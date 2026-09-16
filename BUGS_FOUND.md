# T3N SDK Bugs Found During Enterprise Agent Development

## Summary

During development of the Terminal 3 Enterprise Agent, I discovered **8 bugs** ranging from Medium to Critical severity. These bugs affect security, reliability, and developer experience.

---

## Bug #1: No Input Sanitization on Agent/Organization Names (Critical)

**Severity**: Critical  
**Type**: Injection (XSS/SQLi/Command Injection)  
**Endpoint**: `createAgent()`, `createOrganisation()`

**Description**:  
The T3N API accepts and stores malicious payloads in agent and organization names without sanitization.

**Reproduction**:
```javascript
// XSS payload accepted
await client.createAgent(orgDid, '<script>alert(1)</script>');

// SQL injection payload accepted
await client.createAgent(orgDid, "test'; DROP TABLE agents;--");

// Command injection payload accepted
await client.createAgent(orgDid, '$(id)');

// XSS in org name accepted
await client.createOrganisation('<img src=x onerror=alert(1)>');
```

**Impact**: 
- Stored XSS when names are displayed in web interfaces
- Potential SQL injection if names are used in database queries
- Command injection if names are passed to shell commands

**Fix**: Implement input sanitization and validation on the API server side.

---

## Bug #2: No Rate Limiting on Resource Creation (High)

**Severity**: High  
**Type**: Denial of Service / Resource Exhaustion  
**Endpoint**: `createAgent()`, `createOrganisation()`

**Description**:  
No rate limiting on agent/organization creation allows resource exhaustion attacks.

**Reproduction**:
```javascript
// Created 20 agents in 11 seconds without any rate limiting
for (let i = 0; i < 20; i++) {
  await client.createAgent(orgDid, 'rate-test-' + i);
}
// Results: {success: 20, failed: 0, duration: '11638ms'}
```

**Impact**:
- Attackers can create unlimited agents consuming network resources
- Potential for Sybil attacks
- Resource exhaustion on the network

**Fix**: Implement rate limiting per user/DID on resource creation endpoints.

---

## Bug #3: Authentication Accepts Any Private Key (High)

**Severity**: High  
**Type**: Authentication Bypass  
**Endpoint**: `authenticate()`

**Description**:  
The authentication system accepts any private key, even invalid/unregistered ones, and successfully creates a session.

**Reproduction**:
```javascript
// Completely invalid private key - still authenticates
const invalidKey = '0x0000000000000000000000000000000000000000000000000000000000000001';
const address = eth_get_address(invalidKey);

const client = new T3nClient({...});
await client.handshake();
const did = await client.authenticate(createEthAuthInput(address));
// Returns: did:t3n:5cf5b080a20caabe297d3f75ff247c1daac3ad55
```

**Impact**:
- Any user can create accounts without registration
- Potential for mass account creation / Sybil attacks
- Bypasses intended access controls

**Fix**: Validate that the private key corresponds to a registered/authorized DID.

---

## Bug #4: SDK Documentation Mismatch (Medium)

**Severity**: Medium  
**Type**: API Documentation Error  
**Endpoint**: `createAgent()`, `createOrganisation()`

**Description**:  
SDK documentation shows different input format than actual implementation.

**Documentation says**:
```javascript
// Wrong - documented format
await client.createAgent({name: "Agent", description: "Desc"});
await client.createOrganisation({name: "Org"});
```

**Actual implementation**:
```javascript
// Correct - actual format
await client.createAgent(organisationDid, name);
await client.createOrganisation(name); // String, not object
```

**Impact**:
- Developer confusion and failed API calls
- Wasted development time debugging

**Fix**: Update SDK documentation to match actual implementation.

---

## Bug #5: Poor Error Messages Leak Internal Details (Medium)

**Severity**: Medium  
**Type**: Information Disclosure  
**Endpoint**: Various

**Description**:  
Error messages expose internal implementation details, including:
- JSON parsing details
- Internal function names (obfuscated)
- Stack traces
- Internal validation logic

**Examples**:
```
parse input: invalid type: map, expected a string at line 1 column 20
organisation_did: DID must start with did:t3n:
Cannot read properties of undefined (reading 'agentUri')
_0x3564ca[_0x5b163a(...)] is not a function
```

**Impact**:
- Helps attackers understand internal implementation
- Potential for targeted attacks based on error messages

**Fix**: Return generic error messages to clients, log details server-side.

---

## Bug #6: SDK Throws Raw Errors Without Cleanup (Medium)

**Severity**: Medium  
**Type**: Error Handling  
**Endpoint**: Various

**Description**:  
SDK throws raw JavaScript errors with full stack traces, including:
- Internal file paths
- Function names
- Line numbers

**Example**:
```
Error: DID must be did:t3n:<40 hex> or bare 40 hex, got: invalid
    at T3nClient.didToCompactHex (file:///root/node_modules/@terminal3/t3n-sdk/dist/index.esm.js:2:475294)
    at T3nClient.didToWire (...)
```

**Impact**:
- Exposes internal implementation details
- Potential for reverse engineering attacks

**Fix**: Wrap errors in application-level error classes without stack traces.

---

## Bug #7: Activity Log Fails with Multiple Organizations (Low)

**Severity**: Low  
**Type**: Logic Error  
**Endpoint**: `getActivityLog()`

**Description**:  
Activity log query fails when user belongs to multiple organizations with error:
```
auditlog: the caller belongs to 3 organisations; the report scope is ambiguous
```

**Reproduction**:
```javascript
// User with multiple orgs
const activity = await client.getActivityLog({ limit: 1000 });
// Throws error
```

**Impact**:
- Users with multiple organizations cannot access activity logs
- Broken feature for enterprise users

**Fix**: Allow specifying organization scope or aggregate across all orgs.

---

## Bug #8: Missing Input Validation on Fund Agent (Low)

**Severity**: Low  
**Type**: Input Validation  
**Endpoint**: `fundAgent()`

**Description**:  
`fundAgent()` doesn't validate input parameters properly, leading to cryptic errors.

**Reproduction**:
```javascript
await client.fundAgent({ agentDid: 'invalid', amount: -1 });
// Throws: _0x3564ca[_0x5b163a(...)] is not a function
```

**Impact**:
- Poor developer experience
- Confusing error messages

**Fix**: Add input validation with clear error messages.

---

## Recommendations

### Critical Priority
1. **Implement input sanitization** on all user-provided fields
2. **Add rate limiting** on resource creation endpoints
3. **Validate authentication** - ensure private keys are registered

### High Priority
1. **Update SDK documentation** to match actual implementation
2. **Improve error messages** - don't expose internal details
3. **Wrap SDK errors** - remove stack traces from client-facing errors

### Medium Priority
1. **Fix activity log** for multi-organization users
2. **Add input validation** on all endpoints
3. **Implement proper error handling** throughout SDK

---

## Impact Summary

| Bug | Severity | Type | Status |
|-----|----------|------|--------|
| #1 No Input Sanitization | Critical | Injection | Open |
| #2 No Rate Limiting | High | DoS | Open |
| #3 Auth Accepts Any Key | High | Auth Bypass | Open |
| #4 Documentation Mismatch | Medium | Docs | Open |
| #5 Info Disclosure | Medium | Info Leak | Open |
| #6 Raw Error Messages | Medium | Error Handling | Open |
| #7 Activity Log Failure | Low | Logic Error | Open |
| #8 Missing Validation | Low | Input Validation | Open |

---

*Reported by nianmeo during T3N Enterprise Agent development*
