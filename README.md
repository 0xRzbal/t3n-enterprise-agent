# T3N Enterprise Agent

CLI tool for managing Terminal 3 Network resources.

## Setup

```bash
npm install
```

## Usage

```bash
# Check status
node agent.mjs status

# List agents
node agent.mjs agents

# Create agent
node agent.mjs create-agent <orgDid> "Agent Name"

# Check usage
node agent.mjs usage

# View activity
node agent.mjs activity
```

## Commands

| Command | Description |
|---------|-------------|
| `status` | Show agent status and balance |
| `agents` | List all agents |
| `create-agent` | Create a new agent |
| `fund-agent` | Fund an agent |
| `usage` | Show usage statistics |
| `audit` | Show audit events |
| `activity` | Show activity log |
| `orgs` | List organizations |
| `create-org` | Create organization |
| `help` | Show help |

## Environment

Set your private key:

```bash
export T3N_PRIVATE_KEY="0x..."
```

## License

MIT
