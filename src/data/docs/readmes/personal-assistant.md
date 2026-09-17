# Personal assistant

https://github.com/user-attachments/assets/f4aa0078-e8d4-4649-b624-79d14ec03f13


**Tech stack**

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![pnpm](https://img.shields.io/badge/pnpm-CB3837?style=flat-square&logo=pnpm&logoColor=white)](https://pnpm.io/)
[![LangChain](https://img.shields.io/badge/LangChain.js-agents-121212?style=flat-square)](https://js.langchain.com/)
[![LangGraph](https://img.shields.io/badge/LangGraph-orchestration-1C3C3C?style=flat-square)](https://docs.langchain.com/oss/javascript/langgraph/overview)
[![OpenAI](https://img.shields.io/badge/OpenAI-API-412991?style=flat-square&logo=openai&logoColor=white)](https://platform.openai.com/)
[![Zod](https://img.shields.io/badge/Zod-schema-3068B7?style=flat-square)](https://zod.dev/)

**Design patterns**

[![Supervisor pattern](https://img.shields.io/badge/Pattern-Supervisor-6366F1?style=flat-square)](#architecture)
[![Sub-agents as tools](https://img.shields.io/badge/Pattern-Sub--agents%20as%20tools-7C3AED?style=flat-square)](#architecture)
[![Human-in-the-loop](https://img.shields.io/badge/Pattern-Human--in--the--loop-0891B2?style=flat-square)](#what-this-project-helps-you-learn)
[![Checkpointing](https://img.shields.io/badge/Pattern-Checkpointing%20%26%20resume-0D9488?style=flat-square)](#what-this-project-helps-you-learn)
[![Graph streaming](https://img.shields.io/badge/Pattern-Graph%20streaming-059669?style=flat-square)](#what-this-project-helps-you-learn)

A small TypeScript playground: a **supervisor agent** coordinates **calendar** and **email** sub-agents, with **human-in-the-loop** pauses before sensitive tool calls, **LangGraph** streaming, and a **checkpointer** so the graph can resume after approvals.

---

## What this project helps you learn

| Topic                            | What you practice here                                                                                                                                |
| -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Supervisor pattern**           | A top-level agent delegates work through tools (`schedule_event`, `manage_email`) that each run a full sub-agent, instead of one flat tool list.      |
| **Sub-agents as tools**          | Calendar and email agents are normal LangChain agents with their own prompts and tools; the supervisor sees only the delegation tools.                |
| **Human-in-the-loop**            | `humanInTheLoopMiddleware` interrupts before `create_calendar_event` and `send_email` so a human can approve, edit, or reject before execution.       |
| **LangGraph + resume**           | `MemorySaver` checkpoints state; after an interrupt you build a `Command({ resume })` payload and stream again to continue the same thread.           |
| **Streaming**                    | `supervisorAgent.stream(..., { streamMode: "messages", configurable: { thread_id } })` to observe message updates and interrupt arrays incrementally. |
| **Thread context in delegation** | Delegation tools use `getCurrentTaskInput` + `HumanMessage` to pass the original user message into the sub-agent prompt.                              |
| **TypeScript + pnpm**            | ESM (`"type": "module"`), `NodeNext` resolution, `.js` extensions in imports, `dotenv`, and `@types/node` for `process.env`.                          |
| **Structured logging**           | A custom terminal logger (`src/lib/pretty-logger.ts`) to trace stream chunks, HITL payloads, tool I/O, and timing without extra npm deps.             |

Stub tools in `src/tools/calendar-api.ts` and `src/tools/email-api.ts` stand in for real APIs (Google Calendar, Gmail, etc.), so you can focus on agent orchestration first.

---

## Architecture

High-level data and control flow:

```mermaid
flowchart TB
  subgraph user["User / demo"]
    Q[DEMO_QUERY]
  end

  subgraph sup["Supervisor agent"]
    SA[supervisorAgent]
    T1[schedule_event tool]
    T2[manage_email tool]
    CP[(MemorySaver checkpointer)]
    SA --> T1
    SA --> T2
    SA --- CP
  end

  subgraph cal["Calendar sub-agent"]
    CA[calendarAgent]
    HITL_C[HITL: create_calendar_event]
    API_C[create_calendar_event stub]
    SLOT[get_available_time_slots stub]
    CA --> HITL_C
    CA --> API_C
    CA --> SLOT
  end

  subgraph mail["Email sub-agent"]
    EA[emailAgent]
    HITL_E[HITL: send_email]
    API_E[send_email stub]
    EA --> HITL_E
    EA --> API_E
  end

  Q --> SA
  T1 -->|"invoke with built prompt"| CA
  T2 -->|"invoke with built prompt"| EA
```

Runtime sequence (simplified):

```mermaid
sequenceDiagram
  participant Demo as supervisor-hitl-demo
  participant Sup as supervisorAgent
  participant Cal as calendarAgent
  participant Em as emailAgent
  participant HITL as HITL middleware

  Demo->>Sup: stream(user message, thread_id)
  Sup->>Sup: may call schedule_event / manage_email
  Sup->>Cal: invoke (delegation)
  Cal->>HITL: interrupt before create_calendar_event
  HITL-->>Demo: interrupt payload in stream
  Demo->>Sup: stream(Command resume approve/edit)
  Sup->>Em: invoke (delegation)
  Em->>HITL: interrupt before send_email
  HITL-->>Demo: interrupt payload
  Demo->>Sup: stream(Command resume …)
```

---

## Repository layout

| Path                                         | Role                                                                             |
| -------------------------------------------- | -------------------------------------------------------------------------------- |
| `src/index.ts`                               | Entry: banner, dynamic import of demo (so logs order cleanly).                   |
| `src/config/llm.ts`                          | Shared `ChatOpenAI` instance.                                                    |
| `src/prompts/supervisor-demo.ts`             | System prompts for supervisor + sub-agents.                                      |
| `src/tools/calendar-api.ts` / `email-api.ts` | Low-level stub tools (where HITL attaches for sensitive actions).                |
| `src/tools/delegation.ts`                    | Supervisor-facing tools that call sub-agents with thread context.                |
| `src/agents/*.ts`                            | `calendarAgent`, `emailAgent`, `supervisorAgent` definitions.                    |
| `src/demo/supervisor-hitl-demo.ts`           | Full scripted flow: stream → inspect interrupts → resume → optional second wave. |
| `src/lib/pretty-logger.ts`                   | ANSI logging helpers for learning and debugging.                                 |

---

## Quick start

```bash
pnpm install
cp .env.example .env
# Set OPENAI_API_KEY in .env

pnpm run build
pnpm start
```

Requires **Node 20+** (see `package.json` `engines`).

