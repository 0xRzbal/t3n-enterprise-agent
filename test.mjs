import {
  T3nClient,
  loadWasmComponent,
  createEthAuthInput,
  eth_get_address,
  metamask_sign,
  fetchTrustedManifest,
} from "@terminal3/t3n-sdk";

const privateKey = "0x44fc4620155478ffd6949639c5060898bf0857bb8c93154de7c58d1791272bcc";
const did = "did:t3n:65b9ed6241eed6ecda1c46187358014ace3dacf3";

async function main() {
  console.log("=== Terminal 3 Agent Test ===");
  console.log("Loading WASM component...");
  const wasmComponent = await loadWasmComponent();
  
  console.log("Getting address from private key...");
  const address = eth_get_address(privateKey);
  console.log("Address:", address);
  
  console.log("Fetching trusted manifest...");
  const trustAnchor = await fetchTrustedManifest("sandbox");
  
  console.log("Creating T3nClient...");
  const client = new T3nClient({
    trustAnchor,
    wasmComponent,
    handlers: {
      EthSign: metamask_sign(address, undefined, privateKey),
    },
  });
  
  console.log("Performing handshake...");
  await client.handshake();
  
  console.log("Authenticating...");
  const authDid = await client.authenticate(
    createEthAuthInput(eth_get_address(privateKey))
  );
  
  console.log("Authenticated DID:", authDid.toString());
  console.log("Expected DID:", did);
  
  if (authDid.toString() === did) {
    console.log("SUCCESS: DID matches!");
  } else {
    console.log("WARNING: DID mismatch");
  }
  
  // Explore available methods
  console.log("\n=== Exploring Available Methods ===");
  console.log("Client methods:", Object.getOwnPropertyNames(Object.getPrototypeOf(client)));
}

main().catch(console.error);
