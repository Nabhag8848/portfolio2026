# Log Analyzer

An AI-powered log analysis tool built in Go. It parses application logs in multiple formats, computes error statistics, and uses an OpenAI LLM to surface anomalies and actionable recommendations.

## Features

- **Multi-format parsing** — automatically detects and parses JSON, standard (`YYYY-MM-DD HH:MM:SS [LEVEL] message`), and Nginx/Apache access log formats.
- **Error pattern grouping** — normalizes variable parts of error messages (IDs, UUIDs, emails) so recurring errors are counted together.
- **AI-driven analysis** — sends a summary and log sample to OpenAI to identify anomalies, security concerns, and performance issues.
- **Watch mode** — continuously monitors a log file and re-analyzes on a polling interval.
- **JSON export** — optionally writes the full analysis report to a JSON file.

## Project Structure

```
log-analyzer/
├── cmd/log-analyzer/          CLI entry point
│   └── main.go
├── internal/
│   ├── model/                 Shared types (LogEntry, LogAnalysis, etc.)
│   ├── parser/                Log file parsing and format detection
│   ├── analyzer/              Statistical analysis and LLM integration
│   ├── monitor/               fsnotify-based live file watcher
│   └── report/                Terminal and JSON output formatting
├── scripts/
│   └── simulate-logs.sh       Generates realistic logs for testing
├── testdata/                  Sample log files in each supported format
├── .env.example               Template for local environment variables
└── go.mod
```

## Prerequisites

- Go 1.21+
- An OpenAI API key

## Setup

```bash
# Clone the repo
git clone <repo-url> && cd log-analyzer

# Install dependencies
go mod download

# Configure your API key
cp .env.example .env
# Edit .env and add your OpenAI API key
```

## Usage

### One-shot analysis

```bash
go run ./cmd/log-analyzer -file=testdata/sample.log
```

### Save report to JSON

```bash
go run ./cmd/log-analyzer -file=testdata/sample.log -output=report.json
```

### Watch mode

Polls the file every 30 seconds and re-runs the analysis. Waits for the file to appear if it doesn't exist yet.

```bash
go run ./cmd/log-analyzer -file=live.log -watch
```

## Testing

### Test against sample log files

The `testdata/` directory contains three log files, each exercising a different parser path:

| File | Format | What it covers |
|------|--------|----------------|
| `testdata/json-logs.log` | JSON | Payment service outage, expired JWTs, OOM kill |
| `testdata/nginx-access.log` | Nginx access log | Brute-force login attempts, 502/503/504 errors, deploy recovery |
| `testdata/production-incident.log` | Standard text | Full incident lifecycle: deploy → pool exhaustion → cascade failure → restart loop → failover |

Run any of them:

```bash
go run ./cmd/log-analyzer -file=testdata/production-incident.log
go run ./cmd/log-analyzer -file=testdata/json-logs.log
go run ./cmd/log-analyzer -file=testdata/nginx-access.log
```

### Test watch mode with live log simulation

Open two terminals:

**Terminal 1** — start the watcher:

```bash
go run ./cmd/log-analyzer -file=live.log -watch
```

**Terminal 2** — start the log simulator:

```bash
bash scripts/simulate-logs.sh live.log
```

The simulator walks through six phases of a production incident (startup → steady traffic → warnings → error spike → crash → recovery), appending one line at a time with realistic delays. The watcher in terminal 1 will pick up the changes on its next polling cycle.

### Build and run the binary

```bash
go build -o log-analyzer ./cmd/log-analyzer
./log-analyzer -file=testdata/sample.log
```

