#!/usr/bin/env node

/**
 * Terminal 3 Enterprise Agent
 * 
 * A comprehensive enterprise agent for managing T3N resources.
 * Features:
 * - Agent lifecycle management (create, update, delete, fund)
 * - Usage and balance monitoring
 * - Audit event tracking
 * - Organization management
 * - Activity logging
 * 
 * Usage:
 *   node agent.mjs <command> [options]
 * 
 * Commands:
 *   status          - Show agent status and balance
 *   agents          - List all agents
 *   create-agent    - Create a new agent
 *   fund-agent      - Fund an agent
 *   usage           - Show usage statistics
 *   audit           - Show audit events
 *   activity        - Show activity log
 *   orgs            - List organizations
 *   help            - Show this help message
 */

import {
  T3nClient,
  loadWasmComponent,
  createEthAuthInput,
  eth_get_address,
  metamask_sign,
  fetchTrustedManifest,
} from "@terminal3/t3n-sdk";

const PRIVATE_KEY = process.env.T3N_PRIVATE_KEY || "0x44fc4620155478ffd6949639c5060898bf0857bb8c93154de7c58d1791272bcc";
const DID = "did:t3n:65b9ed6241eed6ecda1c46187358014ace3dacf3";

class T3nAgent {
  constructor() {
    this.client = null;
    this.address = null;
  }

  async init() {
    console.log("Initializing T3nAgent...");
    
    const wasmComponent = await loadWasmComponent();
    this.address = eth_get_address(PRIVATE_KEY);
    
    const trustAnchor = await fetchTrustedManifest("sandbox");
    
    this.client = new T3nClient({
      trustAnchor,
      wasmComponent,
      handlers: {
        EthSign: metamask_sign(this.address, undefined, PRIVATE_KEY),
      },
    });
    
    await this.client.handshake();
    const authDid = await this.client.authenticate(
      createEthAuthInput(this.address)
    );
    
    console.log(`Authenticated as: ${authDid.toString()}`);
    console.log(`Address: ${this.address}`);
    
    return this;
  }

  async getStatus() {
    const status = await this.client.getStatus();
    const balance = await this.client.getBalance();
    const usage = await this.client.getUsage();
    
    return {
      did: DID,
      address: this.address,
      status,
      balance,
      usage,
    };
  }

  async listAgents() {
    // List agents through organization contracts
    const orgs = await this.client.myOrgs();
    return orgs;
  }

  async createAgent(organisationDid, name) {
    const result = await this.client.createAgent(organisationDid, name);
    return result;
  }

  async fundAgent(agentId, amount) {
    const result = await this.client.fundAgent({
      agentId,
      amount,
    });
    return result;
  }

  async getUsage() {
    const usage = await this.client.getUsage();
    return usage;
  }

  async getAuditEvents(limit = 50) {
    const events = await this.client.getAuditEvents({ limit });
    return events;
  }

  async getActivityLog(limit = 50) {
    const log = await this.client.getActivityLog({ limit });
    return log;
  }

  async listOrganizations() {
    const orgs = await this.client.myOrgs();
    return orgs;
  }

  async createOrganization(name) {
    const result = await this.client.createOrganisation(name);
    return result;
  }

  async addOrganizationMember(orgId, memberAddress) {
    const result = await this.client.addOrganisationMember({
      orgId,
      memberAddress,
    });
    return result;
  }

  async removeOrganizationMember(orgId, memberAddress) {
    const result = await this.client.removeOrganisationMember({
      orgId,
      memberAddress,
    });
    return result;
  }

  async checkDelegation(agentId) {
    const delegation = await this.client.checkDelegation({
      agentId,
    });
    return delegation;
  }

  async listContracts() {
    const contracts = await this.client.listContracts();
    return contracts;
  }

  async execute(operation, params) {
    const result = await this.client.execute({
      operation,
      params,
    });
    return result;
  }
}

// CLI interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || "help";
  
  const agent = new T3nAgent();
  await agent.init();
  
  switch (command) {
    case "status":
      const status = await agent.getStatus();
      console.log("\n=== Agent Status ===");
      console.log(JSON.stringify(status, null, 2));
      break;
      
    case "agents":
      const agents = await agent.listAgents();
      console.log("\n=== Agents ===");
      console.log(JSON.stringify(agents, null, 2));
      break;
      
    case "create-agent":
      const orgDid = args[1] || DID;
      const agentName = args[2] || "Enterprise Agent";
      const result = await agent.createAgent(orgDid, agentName);
      console.log("\n=== Created Agent ===");
      console.log(JSON.stringify(result, null, 2));
      break;
      
    case "fund-agent":
      const agentId = args[1];
      const amount = args[2] || "1000";
      if (!agentId) {
        console.error("Usage: fund-agent <agentId> [amount]");
        process.exit(1);
      }
      const fundResult = await agent.fundAgent(agentId, amount);
      console.log("\n=== Funded Agent ===");
      console.log(JSON.stringify(fundResult, null, 2));
      break;
      
    case "usage":
      const usage = await agent.getUsage();
      console.log("\n=== Usage Statistics ===");
      console.log(JSON.stringify(usage, null, 2));
      break;
      
    case "audit":
      const events = await agent.getAuditEvents();
      console.log("\n=== Audit Events ===");
      console.log(JSON.stringify(events, null, 2));
      break;
      
    case "activity":
      const log = await agent.getActivityLog();
      console.log("\n=== Activity Log ===");
      console.log(JSON.stringify(log, null, 2));
      break;
      
    case "orgs":
      const orgs = await agent.listOrganizations();
      console.log("\n=== Organizations ===");
      console.log(JSON.stringify(orgs, null, 2));
      break;
      
    case "create-org":
      const orgName = args[1] || "Enterprise Organization";
      const orgResult = await agent.createOrganization(orgName);
      console.log("\n=== Created Organization ===");
      console.log(JSON.stringify(orgResult, null, 2));
      break;
      
    case "contracts":
      const contracts = await agent.listContracts();
      console.log("\n=== Contracts ===");
      console.log(JSON.stringify(contracts, null, 2));
      break;
      
    case "help":
    default:
      console.log(`
Terminal 3 Enterprise Agent

Usage: node agent.mjs <command> [options]

Commands:
  status                      Show agent status and balance
  agents                      List all agents
  create-agent [orgDid] [name] Create a new agent
  fund-agent <id> [amount]    Fund an agent
  usage                       Show usage statistics
  audit                       Show audit events
  activity                    Show activity log
  orgs                        List organizations
  create-org [name]           Create organization
  contracts                   List contracts
  help                        Show this help message

Environment Variables:
  T3N_PRIVATE_KEY             Your private key (default: built-in key)
      `);
      break;
  }
}

main().catch(console.error);
