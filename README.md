# Terminal 3 Enterprise Agent

A comprehensive enterprise agent for managing T3N resources with focus on usefulness and ease of maintenance.

## Features

### Agent Lifecycle Management
- **Create Agent**: Create new agents within organizations
- **Fund Agent**: Allocate credits to agents
- **Delete Agent**: Remove agents and clean up resources

### Monitoring & Observability
- **Status Dashboard**: Real-time agent status and balance
- **Usage Statistics**: Track credit consumption and resource usage
- **Audit Events**: Complete audit trail of all operations
- **Activity Log**: Detailed activity history with timestamps

### Organization Management
- **Create Organizations**: Set up enterprise organizations
- **Member Management**: Add/remove organization members
- **Delegation Control**: Manage agent permissions and access

### Security & Compliance
- **Encrypted Communication**: All data encrypted via WASM
- **Audit Trail**: Complete operation history for compliance
- **Access Control**: Fine-grained delegation management

## Quick Start

### Prerequisites
- Node.js >= 18.0.0
- Terminal 3 API key (private key of registered ETH wallet)

### Installation

```bash
npm install @terminal3/t3n-sdk
```

### Usage

```bash
# Show agent status
node agent.mjs status

# List all agents
node agent.mjs agents

# Create a new organization
node agent.mjs create-org "My Organization"

# Create an agent in the organization
node agent.mjs create-agent <orgDid> "Agent Name"

# Fund an agent
node agent.mjs fund-agent <agentId> <amount>

# View usage statistics
node agent.mjs usage

# View audit events
node agent.mjs audit

# View activity log
node agent.mjs activity
```

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Enterprise Agent                          │
├─────────────────────────────────────────────────────────────┤
│  CLI Interface                                              │
│  ├── Status Commands                                        │
│  ├── Agent Management                                       │
│  ├── Organization Management                                │
│  └── Monitoring Commands                                    │
├─────────────────────────────────────────────────────────────┤
│  T3nAgent Class                                             │
│  ├── Authentication (Ethereum-based)                        │
│  ├── Agent Lifecycle                                        │
│  ├── Organization Management                                │
│  └── Monitoring & Logging                                   │
├─────────────────────────────────────────────────────────────┤
│  T3nClient SDK                                              │
│  ├── WASM Cryptography                                      │
│  ├── Encrypted Communication                                │
│  └── State Machine Logic                                    │
├─────────────────────────────────────────────────────────────┤
│  T3N Network                                                │
│  ├── Sandbox (Testing)                                      │
│  └── Production (Mainnet)                                   │
└─────────────────────────────────────────────────────────────┘
```

## API Reference

### T3nAgent Methods

| Method | Description |
|--------|-------------|
| `init()` | Initialize client and authenticate |
| `getStatus()` | Get agent status and balance |
| `listAgents()` | List all agents in organizations |
| `createAgent(orgDid, name)` | Create new agent |
| `fundAgent(agentId, amount)` | Fund an agent |
| `getUsage()` | Get usage statistics |
| `getAuditEvents(limit)` | Get audit events |
| `getActivityLog(limit)` | Get activity log |
| `listOrganizations()` | List organizations |
| `createOrganization(name)` | Create new organization |

### T3nClient SDK Methods

| Method | Description |
|--------|-------------|
| `handshake()` | Establish secure connection |
| `authenticate(authInput)` | Authenticate with credentials |
| `execute(operation, params)` | Execute operations |
| `getBalance()` | Get account balance |
| `getUsage()` | Get usage statistics |
| `getAuditEvents(params)` | Get audit events |
| `getActivityLog(params)` | Get activity log |

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `T3N_PRIVATE_KEY` | Private key for authentication | Built-in demo key |

## Enterprise Use Cases

### 1. Automated Resource Monitoring
```bash
# Run as cron job to monitor usage
node agent.mjs usage >> /var/log/t3n-usage.log
```

### 2. Agent Fleet Management
```bash
# Create multiple agents for different tasks
node agent.mjs create-agent <orgDid> "Monitoring Agent"
node agent.mjs create-agent <orgDid> "Processing Agent"
node agent.mjs create-agent <orgDid> "Reporting Agent"
```

### 3. Compliance Reporting
```bash
# Generate audit reports
node agent.mjs audit > /var/log/t3n-audit-$(date +%Y%m%d).json
```

### 4. Activity Monitoring
```bash
# Track all operations
node agent.mjs activity --limit 1000 > /var/log/t3n-activity.json
```

## Maintenance

### Ease of Maintenance
1. **Single File Deployment**: Agent is a single Node.js script
2. **No External Dependencies**: Only uses official T3N SDK
3. **Configuration via Environment**: Easy to configure in any environment
4. **Structured Logging**: JSON output for easy parsing and monitoring

### Updates
```bash
# Update SDK
npm update @terminal3/t3n-sdk

# Pull latest agent
git pull origin main
```

## Security Considerations

1. **Private Key Security**: Store private key securely (use environment variables)
2. **Access Control**: Use organization-based access control
3. **Audit Trail**: All operations are logged for compliance
4. **Encrypted Communication**: All data encrypted via WASM

## License

MIT

## Support

- Documentation: https://docs.terminal3.io
- Developer Telegram: https://t.me/terminal3dev
