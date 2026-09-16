#!/usr/bin/env node

/**
 * Terminal 3 Enterprise Agent - Verification Script (Fixed)
 */

import {
  T3nClient,
  loadWasmComponent,
  createEthAuthInput,
  eth_get_address,
  metamask_sign,
  fetchTrustedManifest,
} from "@terminal3/t3n-sdk";

const PRIVATE_KEY = "0x44fc4620155478ffd6949639c5060898bf0857bb8c93154de7c58d1791272bcc";
const DID = "did:t3n:65b9ed6241eed6ecda1c46187358014ace3dacf3";

async function main() {
  console.log("╔════════════════════════════════════════════════════════════╗");
  console.log("║     Terminal 3 Enterprise Agent - Verification            ║");
  console.log("╚════════════════════════════════════════════════════════════╝\n");
  
  // Initialize
  console.log("1. Initializing...");
  const wasmComponent = await loadWasmComponent();
  const address = eth_get_address(PRIVATE_KEY);
  const trustAnchor = await fetchTrustedManifest("sandbox");
  
  const client = new T3nClient({
    trustAnchor,
    wasmComponent,
    handlers: {
      EthSign: metamask_sign(address, undefined, PRIVATE_KEY),
    },
  });
  
  await client.handshake();
  const authDid = await client.authenticate(createEthAuthInput(address));
  console.log("   ✓ Authenticated");
  console.log("   DID:", authDid.toString());
  console.log("   Address:", address);
  
  // Test Status
  console.log("\n2. Status...");
  const status = await client.getStatus();
  const balance = await client.getBalance();
  console.log("   ✓ Status:", status);
  console.log("   ✓ Balance:", balance.available, "credits");
  
  // Test Organizations
  console.log("\n3. Organizations...");
  const orgs = await client.myOrgs();
  console.log("   ✓ Found", orgs.length, "organization(s)");
  if (orgs.length > 0) {
    console.log("   ✓ Primary:", orgs[0].value);
  }
  
  // Test Usage
  console.log("\n4. Usage...");
  const usage = await client.getUsage();
  console.log("   ✓ Available:", usage.balance.available, "credits");
  console.log("   ✓ Entries:", usage.entries.length);
  
  // Test Audit
  console.log("\n5. Audit Events...");
  const audit = await client.getAuditEvents({ limit: 10 });
  console.log("   ✓ Batches:", audit.batches.length);
  
  // Test Contracts
  console.log("\n6. Contracts...");
  const contracts = await client.listContracts();
  console.log("   ✓ Available:", contracts.length > 0 ? "Yes" : "No");
  
  console.log("\n╔════════════════════════════════════════════════════════════╗");
  console.log("║                    VERIFICATION COMPLETE                  ║");
  console.log("╚════════════════════════════════════════════════════════════╝");
  console.log("\nKey Information:");
  console.log("  DID:", DID);
  console.log("  Address:", address);
  console.log("  Organizations:", orgs.length);
  console.log("  Balance:", balance.available, "credits");
  console.log("\nGitHub: https://github.com/0xRzbal/t3n-enterprise-agent");
}

main().catch(console.error);
