# ask-postgres

[![Go](https://img.shields.io/badge/Go-1.24+-00ADD8?style=flat&logo=go&logoColor=white)](https://go.dev/) [![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat&logo=postgresql&logoColor=white)](https://www.postgresql.org/) [![Bubble Tea](https://img.shields.io/badge/Bubble%20Tea-TUI-FF67C7?style=flat)](https://github.com/charmbracelet/bubbletea) [![pgx](https://img.shields.io/badge/pgx-v5-003B57?style=flat&logo=postgresql&logoColor=white)](https://github.com/jackc/pgx) [![langchaingo](https://img.shields.io/badge/langchaingo-agents-7C3AED?style=flat)](https://github.com/tmc/langchaingo) [![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat&logo=docker&logoColor=white)](https://docs.docker.com/compose/)

![Screen recording of the ask-postgres TUI](assets/ask-postgres.gif)

---

## What this project is

**ask-postgres** is a terminal application that lets you ask questions about **your own** PostgreSQL database in plain English. You provide a connection string and an API key for a supported LLM provider; the app runs a full-screen TUI (Bubble Tea), streams an assistant’s replies, and uses **read-only** database tools under the hood so the model can inspect schema, describe tables, and run capped `SELECT`-style queries—then answer in normal language.

There is no bundled web UI and no ask-postgres cloud service: **your Postgres** and **your shell** are the runtime. Sessions and preferences live on disk under your home directory (see [Data and privacy](#data-and-privacy)).

### What happens when you ask a question

1. The LLM is given tools to explore the database (schema overview, table description, read-only SQL with row and time limits).
2. Queries execute in a **read-only** session; result sets are **row-capped** by default so responses stay small and predictable.
3. The assistant is instructed to discover real table and column names via tools rather than guessing, and to answer in conversational language unless you ask for technical detail.

### When it is useful

- Onboarding to an unfamiliar schema or naming conventions.
- Quick counts, distributions, or spot checks without writing SQL first.
- Drafting queries you might later refine in a notebook or application code.
- A narrative read on what tables actually contain, driven by samples and aggregates.

### Stack (for contributors and operators)

| Piece | Role |
| --- | --- |
| **Go** | Single binary, `go run .` or `go build` from repo root. |
| **pgx/v5** | Connection pool to PostgreSQL. |
| **langchaingo** | Agent loop, LLM adapters, tools. |
| **Bubble Tea** | TUI: transcript, input, themes, slash commands, mouse wheel scrolling where supported. |

---

## Capabilities at a glance

| | |
| --- | --- |
| **Your database** | Connects only to the Postgres URL you provide (local, VPN, or cloud). |
| **Natural language** | Describe intent; the agent uses tools, then replies in prose. |
| **Read-only by design** | Read-only transaction semantics; tooling steers away from writes and DDL. |
| **Sampling limits** | Each data pull is row-capped by default (`--max-rows`; default `10`). |
| **TUI** | Sessions, themes, `/model`, `/settings` for keys, scrollable transcript. |
| **LLM backends** | OpenAI-compatible (including custom base URL), Anthropic (Claude), Google (Gemini)—choose in-app or via environment. |

---

## Data and privacy

ask-postgres is built so **your workflow stays on your machine** unless you point the app at a cloud model API.

- **Sessions and chat history** are stored as JSON under your home directory, typically `~/.ask-postgres/sessions/`. There is no vendor-hosted copy of your conversations from this project.
- **PostgreSQL** is whatever you configure; the app does not host or mirror your data.
- **Global preferences** (default model, theme, API keys saved from `/settings`) are stored in `config.json` next to that data, under the same app root directory.
- **LLM traffic** uses the public internet when you use OpenAI, Anthropic, or Google. For a fully local model stack, use an **OpenAI-compatible** local server (for example Ollama or LM Studio) and pass `--openai-base-url` plus a matching `--model` name.

To store all application data in a custom location:

```bash
export ASK_POSTGRES_HOME="/custom/path"
```

---

## Requirements

- **Go 1.24.4+** (see `go.mod`) to build or run from source.
- A **PostgreSQL** instance you can reach, and a **connection string** (`DATABASE_URL` or `--db`).
- An **API key** for at least one provider—**OpenAI**, **Anthropic**, or **Google**—matching the model you select, unless you use a fully local OpenAI-compatible endpoint with `--openai-base-url`.

---

## Setup

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd ask-postgres
```

### 2. Environment variables

Copy the example file and edit it for your environment:

```bash
cp .env.example .env
```

The application loads `.env` from the **current working directory** on startup (via `godotenv`).

| Variable | Purpose |
| --- | --- |
| `OPENAI_API_KEY` | OpenAI or OpenAI-compatible API key. |
| `ANTHROPIC_API_KEY` | Anthropic API key (Claude). |
| `GOOGLE_API_KEY` | Google API key (Gemini). |
| `MODEL` | Default model id if you do not pass `--model` and have not set another default in the app. |
| `DATABASE_URL` | Postgres URL; can be omitted if you always pass `--db`. |
| `ASK_POSTGRES_PG_PORT` | Optional; used with Docker Compose to map the host port (default `5000` in `docker-compose.yml`). |

Set **at least one** provider key for the provider your chosen model uses. You can also save keys in the TUI via **`/settings`** (persisted in `config.json` under the app data directory).

### 3. Optional: demo database with Docker

If you want a small sample database without installing Postgres locally:

```bash
docker compose up -d
```

By default the service maps host port **5000** to the container. If that port is in use:

```bash
export ASK_POSTGRES_PG_PORT=5001
docker compose up -d
```

The Compose file provisions user `askpostgres`, password `askpostgres`, database `analytics`, and runs seed SQL from `db/init/`. Point the app at it, for example:

```bash
export DATABASE_URL="postgres://askpostgres:askpostgres@localhost:${ASK_POSTGRES_PG_PORT:-5000}/analytics?sslmode=disable"
```

(Adjust the port to match `ASK_POSTGRES_PG_PORT` if you changed it.)

### 4. Run the application

From the repository root:

```bash
go run .
```

Or build a binary:

```bash
go build -o ask-postgres .
./ask-postgres
```

If `DATABASE_URL` is not set, pass the DSN explicitly:

```bash
go run . --db "postgres://user:pass@localhost:5432/mydb?sslmode=disable"
```

### Default model selection order

When you do not pass a different `--model` on the command line, the effective default is resolved in this order:

1. **`MODEL`** environment variable (if set).
2. **`config.json`** `model` field (from `/settings` or prior runs).
3. Built-in default **`gpt-4.1-mini`** (OpenAI-style id).

Passing **`--model`** explicitly always wins.

### Command-line flags

| Flag | Description |
| --- | --- |
| `--db` | Postgres connection string. Overrides `DATABASE_URL`. |
| `--model` | LLM model id (overrides env and saved config). |
| `--max-rows` | Maximum rows returned per read-only SQL tool call (default `10`). |
| `--query-timeout` | Per-query timeout for the SQL tool (default `5s`). |
| `--openai-base-url` | Base URL for an OpenAI-compatible API (local or custom gateway). |

---

## Using the TUI

- **Welcome screen** appears when the transcript is empty. It is UI-only and is **not** sent to the model as chat.
- **Layout:** transcript → **input** (below the conversation) → **status** line (hints, streaming state, current model).
- **Long answers:** scroll the transcript with **PgUp** / **PgDn** or the **mouse wheel** where the terminal supports it. **↑** / **↓** move through **input history**, not the chat log.
- **?** opens the shortcuts sheet.
- **Enter** sends your message.
- **`/help`** lists slash commands (sessions, themes, `/model`, `/settings`, and others).
- **`/model`** opens the curated model list for providers you have configured.
- **Ctrl+L** clears the on-screen transcript. **`/clear`** clears persisted session history and the assistant’s in-memory context for the current chat; see **`/help`** for session-related commands.

---

## Behaviour and trust

- **Read-only:** Database work is constrained to read paths; the assistant is instructed not to perform writes or schema changes.
- **Row caps:** Defaults keep samples small; increase when needed, for example `go run . --max-rows 200`.
- **Providers:** OpenAI-compatible, Anthropic, and Google models are supported via `/model` and the environment variables above.
- **Transcript scrolling:** If you scroll up, streaming typically does not force the view to the bottom unless you were already following the latest output.

---

## Troubleshooting

Startup failures are usually explicit: missing `DATABASE_URL` / `--db`, a missing API key for the selected model, or an unreachable database. Read the message in the terminal header and fix environment variables or flags accordingly.

Ensure your Postgres URL uses the correct host, port, database name, and `sslmode` for your environment (`disable` is common for local development only).

