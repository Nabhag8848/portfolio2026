# Customer Support Agent

A state-machine-based customer support agent built with **LangChain**, **LangGraph**, and **OpenAI**. A single agent dynamically swaps its instructions and tools as it progresses through a structured support workflow — collecting warranty info, classifying the issue, and resolving it — with the ability to go back and correct earlier steps.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          index.ts (runner)                          │
│              Creates agent, sends messages per thread               │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        agent.ts (factory)                           │
│         buildAgent() → model + tools + middleware + memory          │
└──────┬──────────────────────────┬───────────────────────┬───────────┘
       │                          │                       │
       ▼                          ▼                       ▼
┌──────────────┐   ┌───────────────────────┐   ┌──────────────────┐
│  middleware/  │   │       steps/          │   │   LangGraph      │
│  step-router │◄──┤  STEP_CONFIG mapping  │   │   MemorySaver    │
│              │   │  (prompt+tools+deps)  │   │   (checkpointer) │
└──────┬───────┘   └───────┬───────────────┘   └──────────────────┘
       │                   │
       │         ┌─────────┼─────────┐
       │         ▼         ▼         ▼
       │   ┌──────────┐ ┌────────┐ ┌────────────┐
       │   │ prompts/ │ │ tools/ │ │  state/    │
       │   │          │ │        │ │  schemas   │
       │   └──────────┘ └────────┘ └────────────┘
       │                   │
       ▼                   ▼
  Reads currentStep   ┌────────────────────────────────────────┐
  from state, looks   │          Tool Modules                  │
  up config, injects  │                                        │
  prompt + tools      │  warranty.ts    → recordWarrantyStatus │
                      │  classification.ts → recordIssueType   │
                      │  resolution.ts  → provideSolution      │
                      │                   escalateToHuman      │
                      │  navigation.ts  → goBackToWarranty     │
                      │                   goBackToClassification│
                      └────────────────────────────────────────┘
```

### Workflow State Machine

```
    ┌───────────────────┐
    │  Customer reports  │
    │    an issue        │
    └────────┬──────────┘
             ▼
  ┌─────────────────────┐
  │  warranty_collector  │  ◄─── go_back_to_warranty
  │  Ask warranty status │
  └────────┬─────────────┘
           │ record_warranty_status
           ▼
  ┌─────────────────────┐
  │  issue_classifier    │  ◄─── go_back_to_classification
  │  Hardware / Software │
  └────────┬─────────────┘
           │ record_issue_type
           ▼
  ┌──────────────────────────────────────────────┐
  │           resolution_specialist               │
  │                                               │
  │  Software ──► provide_solution                │
  │  Hardware + In Warranty ──► provide_solution  │
  │  Hardware + Out of Warranty ──► escalate      │
  │                                               │
  │  Wrong info? ──► go_back_to_warranty          │
  │               ──► go_back_to_classification   │
  └───────────────────────────────────────────────┘
```

Tools drive transitions forward by setting `currentStep` via LangGraph `Command` objects. The middleware reads `currentStep` each turn and swaps in the matching prompt and tool set. Navigation tools allow backward transitions for corrections.

## Project Structure

```
src/
├── state/
│   ├── schemas.ts          # Zod schemas: SupportStep, WarrantyStatus, IssueType
│   └── index.ts            # StateSchema definition, re-exports types
├── tools/
│   ├── warranty.ts         # recordWarrantyStatus — collects warranty, advances to classifier
│   ├── classification.ts   # recordIssueType — classifies issue, advances to resolution
│   ├── resolution.ts       # provideSolution, escalateToHuman — resolve or escalate
│   ├── navigation.ts       # goBackToWarranty, goBackToClassification — backward transitions
│   └── index.ts            # Barrel re-exports
├── prompts/
│   └── index.ts            # Prompt templates per step (warranty, classifier, resolution)
├── steps/
│   └── index.ts            # STEP_CONFIG mapping + ALL_TOOLS collection
├── middleware/
│   └── step-router.ts      # Reads currentStep, validates preconditions, injects config
├── agent.ts                # buildAgent() factory — wires model, tools, middleware, memory
└── index.ts                # Runner — demo conversation with 5 turns
```

## Setup

### Prerequisites

- **Node.js** >= 18
- **pnpm** (any recent version)
- An **OpenAI API key**

### Install

```bash
git clone <repo-url> && cd customer-support-agent
pnpm install
```

### Configure

```bash
cp .env.example .env
```

Edit `.env` and add your key:

```
OPENAI_API_KEY=sk-your-key-here
```

### Run

```bash
# Development (no build step, runs TypeScript directly)
pnpm dev

# Or build and run compiled output
pnpm build
pnpm start
```

## How It Works

1. **Single agent, dynamic config** — one LangChain agent whose system prompt and available tools change based on the `currentStep` state field.

2. **Tools drive transitions** — each workflow tool (e.g. `recordWarrantyStatus`) returns a LangGraph `Command` that updates both the collected data and `currentStep`, moving the workflow forward.

3. **Middleware applies config** — the step-router middleware reads `currentStep`, looks up the matching entry in `STEP_CONFIG`, validates that required state is present, templates state values into the prompt, and injects the step's tools.

4. **Memory across turns** — LangGraph's `MemorySaver` checkpointer persists state (messages, currentStep, warrantyStatus, issueType) across conversation turns using a thread ID.

5. **Backward transitions** — the resolution step includes `go_back_to_warranty` and `go_back_to_classification` tools so the agent can correct earlier information without losing conversation context.

## Key Dependencies

| Package                | Purpose                                       |
| ---------------------- | --------------------------------------------- |
| `langchain`            | Agent framework, middleware, tool definitions |
| `@langchain/openai`    | OpenAI chat model integration                 |
| `@langchain/langgraph` | State management, Command, MemorySaver        |
| `@langchain/core`      | Message types (HumanMessage, ToolMessage)     |
| `zod`                  | Schema validation for state and tool inputs   |
| `dotenv`               | Environment variable loading                  |
| `tsx`                  | Run TypeScript directly in development        |

