# Agents Skill Pattern

A TypeScript project demonstrating the **progressive skill disclosure** pattern for LLM agents built with LangChain and LangGraph.

Instead of stuffing every piece of domain knowledge into the system prompt (wasting tokens and diluting attention), the agent sees a lightweight menu of available skills and loads full details **on demand** via a tool call.

## How It Works

```
┌─────────────────────────────────────────────────────────────┐
│                        Agent Runtime                        │
│                                                             │
│  ┌───────────┐    ┌──────────────────┐    ┌──────────────┐  │
│  │  User Msg  │───▶│   Middleware      │───▶│     LLM      │  │
│  └───────────┘    │                  │    │  (GPT-4.1)   │  │
│                   │  • Appends skill │    └──────┬───────┘  │
│                   │    menu to the   │           │          │
│                   │    system prompt │     Decides to call  │
│                   │  • Registers     │     load_skill tool  │
│                   │    load_skill    │           │          │
│                   └──────────────────┘           ▼          │
│                                        ┌────────────────┐   │
│                                        │  load_skill    │   │
│                                        │  Tool          │   │
│                                        │                │   │
│                                        │  Looks up full │   │
│                                        │  skill content │   │
│                                        │  from SKILLS[] │   │
│                                        └───────┬────────┘   │
│                                                │            │
│                                                ▼            │
│                                        ┌────────────────┐   │
│                                        │  LLM (2nd call)│   │
│                                        │  Now has full   │   │
│                                        │  schema — writes│   │
│                                        │  the SQL query  │   │
│                                        └────────────────┘   │
│                                                             │
│  Memory: MemorySaver (in-memory checkpointer per thread)    │
└─────────────────────────────────────────────────────────────┘
```

### Step-by-step flow

1. **`src/index.ts`** — Entry point. Creates a conversation thread and sends a user message to the agent.
2. **`src/agent.ts`** — Constructs the agent with `createAgent`, attaching the LLM, a base system prompt, the skill middleware, and a memory checkpointer.
3. **`src/middleware/skill-middleware.ts`** — The middleware does two things at setup:
   - **Registers** the `load_skill` tool onto the agent's tool belt.
   - **Wraps every LLM call** via `wrapModelCall` to append a skills menu (names + short descriptions) to the system prompt.
4. **LLM decides** it needs more context and calls `load_skill("sales_analytics")`.
5. **`src/tools/load-skill.ts`** — The tool looks up the skill by name in the `SKILLS` array and returns the full content (schema, business rules, example queries).
6. **LLM's second call** — Now has full domain knowledge in context and generates the correct SQL query.

### Why this pattern?

| Approach                          | Tokens used         | Accuracy                     |
| --------------------------------- | ------------------- | ---------------------------- |
| Dump all schemas in system prompt | High (always)       | Lower (diluted attention)    |
| **Progressive skill disclosure**  | **Low (on demand)** | **Higher (focused context)** |

## Project Structure

```
src/
├── index.ts                        # Entry point — invoke agent, print results
├── agent.ts                        # Agent construction (model, middleware, memory)
├── middleware/
│   └── skill-middleware.ts         # Appends skill menu + registers load_skill tool
├── tools/
│   └── load-skill.ts              # Tool that loads full skill content by name
└── skills/
    ├── types.ts                    # Skill schema (Zod) and TypeScript type
    ├── sales-analytics.ts          # Sales domain: customers, orders, revenue
    ├── inventory-management.ts     # Inventory domain: products, warehouses, stock
    └── index.ts                    # Aggregated SKILLS array + re-exports
```

## Setup

```bash
# Install dependencies
pnpm install

# Set your OpenAI API key
cp .env.example .env
# Edit .env and add your key

# Run the agent
pnpm start

# Run with file watching (dev mode)
pnpm dev
```

## Adding a New Skill

1. Create a new file in `src/skills/` (e.g. `src/skills/my-skill.ts`):

```typescript
import { context } from "langchain";
import type { Skill } from "./types.js";

export const mySkill: Skill = {
  name: "my_skill",
  description: "Short description shown in the skill menu.",
  content: context`
    Full detailed content the agent receives
    when it calls load_skill("my_skill").
  `,
};
```

2. Register it in `src/skills/index.ts`:

```typescript
import { mySkill } from "./my-skill.js";

export const SKILLS: Skill[] = [salesAnalytics, inventoryManagement, mySkill];
```

That's it — the middleware automatically picks up new skills from the `SKILLS` array.

## Tech Stack

- **LangChain** — `tool`, `createAgent`, `createMiddleware`, `context`
- **LangGraph** — `MemorySaver` (checkpointing), `Command`
- **LangChain OpenAI** — `ChatOpenAI` (GPT-4.1-mini)
- **Zod** — Runtime schema validation for skill definitions
- **TypeScript** — Strict mode, ES modules

