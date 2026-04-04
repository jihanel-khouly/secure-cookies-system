# Secure Cookies and Digital Signature System

A comprehensive educational demonstration of cryptographic security concepts including HMAC-protected cookies and RSA digital signatures.

## Overview

This system demonstrates two critical security mechanisms used in modern web applications:

### Part A: HMAC-Protected Cookies

**Message Authentication Codes (HMAC)** protect cookies from tampering by combining a hash function (SHA-256) with a server-side secret key. The server generates an authentication tag for each cookie, and any modification to the cookie content invalidates the tag.

**Key Concepts:**
- **HMAC-SHA256**: Combines SHA-256 hashing with a secret key to create unforgeable authentication tags
- **Server-Side Secret**: Only the server knows the secret key, making it impossible for clients to forge valid tags
- **Constant-Time Comparison**: Uses timing-safe comparison to prevent timing attacks
- **Expiration Timestamps**: Cookies include expiration times to limit their validity

**Security Properties:**
- **Integrity**: Detects any modification to cookie content
- **Authenticity**: Proves the cookie came from the server
- **Replay Protection**: Expired cookies are rejected

### Part B: RSA Digital Signatures

**Digital Signatures** use asymmetric cryptography (RSA) to prove both the authenticity and integrity of files. A private key signs files, and a public key verifies signatures, proving the file hasn't been modified.

**Key Concepts:**
- **RSA Key Pairs**: Generate mathematically related private and public keys
- **SHA-256 Hashing**: Files are hashed before signing to create compact signatures
- **Asymmetric Cryptography**: Private key encrypts, public key decrypts (reverse of normal encryption)
- **Non-Repudiation**: Signer cannot deny having signed a document

**Security Properties:**
- **Authenticity**: Proves who signed the file
- **Integrity**: Detects any modification to the file
- **Non-Repudiation**: Signer cannot deny signing the file

## Architecture

### Database Schema

The system uses three main tables:

```sql
-- Users table (provided by template)
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  openId VARCHAR(64) UNIQUE NOT NULL,
  name TEXT,
  email VARCHAR(320),
  role ENUM('user', 'admin'),
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW(),
  lastSignedIn TIMESTAMP DEFAULT NOW()
);

-- RSA Key Pairs table
CREATE TABLE rsa_key_pairs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  private_key LONGTEXT NOT NULL,  -- PEM format
  public_key LONGTEXT NOT NULL,   -- PEM format
  key_size INT NOT NULL,          -- 2048, 4096, etc.
  generated_at TIMESTAMP DEFAULT NOW()
);

-- Signed Files table
CREATE TABLE signed_files (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  key_pair_id INT NOT NULL,
  filename VARCHAR(255) NOT NULL,
  file_content LONGTEXT NOT NULL,      -- Base64 encoded
  signature LONGTEXT NOT NULL,         -- Base64 encoded
  file_hash VARCHAR(64) NOT NULL,      -- SHA-256 hex
  signed_at TIMESTAMP DEFAULT NOW()
);
```

### Backend Implementation

**Cryptographic Functions** (`server/crypto.ts`):
- `generateHMAC()`: Creates HMAC-SHA256 tags for cookies
- `verifyHMAC()`: Verifies HMAC tags with constant-time comparison
- `createSecureCookie()`: Generates complete cookie objects with expiration
- `verifySecureCookie()`: Validates cookies and checks expiration
- `generateRSAKeyPair()`: Creates 2048-bit RSA key pairs
- `signFile()`: Signs file content with RSA private key
- `verifySignature()`: Verifies signatures with RSA public key
- `calculateFileHash()`: Computes SHA-256 hashes

**Database Helpers** (`server/db.ts`):
- `createRSAKeyPair()`: Stores key pairs in database
- `getUserRSAKeyPairs()`: Retrieves user's key pairs
- `getRSAKeyPairById()`: Gets specific key pair
- `createSignedFile()`: Stores signed files
- `getUserSignedFiles()`: Lists user's signed files
- `getSignedFileById()`: Retrieves specific signed file

**tRPC Procedures** (`server/routers.ts`):
- `cookies.generateSecureCookie`: Public procedure to generate cookies
- `cookies.verifySecureCookie`: Public procedure to verify cookies
- `signatures.generateKeyPair`: Protected procedure to create RSA keys
- `signatures.getKeyPairs`: Protected procedure to list key pairs
- `signatures.signFile`: Protected procedure to sign files
- `signatures.getSignedFiles`: Protected procedure to list signed files
- `signatures.verifyFileSignature`: Protected procedure to verify signatures
- `signatures.getSignedFile`: Protected procedure to retrieve signed file

### Frontend Pages

**Home Page** (`client/src/pages/Home.tsx`):
- Overview of both security concepts
- Navigation to all demonstration pages
- Educational content about cryptography

**Cookie Demo Page** (`client/src/pages/CookieDemo.tsx`):
- **Generate Tab**: Create HMAC-protected cookies with custom parameters
- **Verify Tab**: Test cookie verification and tampering detection
- Interactive tampering buttons to modify payload or tag
- Real-time verification results

**Signature Demo Page** (`client/src/pages/SignatureDemo.tsx`):
- **Key Generation Tab**: Create and manage RSA key pairs
- **Sign File Tab**: Sign files with private key
- **Verify Signature Tab**: Verify file authenticity and detect modifications
- List of previously signed files for testing

## Security Demonstrations

### Cookie Tampering Detection

1. Generate a cookie with username, role, and expiration
2. Copy the payload and HMAC tag
3. Click "Tamper with Payload" to change the role from "user" to "admin"
4. Click "Verify Cookie" to see the verification fail
5. The server rejects the cookie because the HMAC tag no longer matches

**Why This Matters**: Even if an attacker can access a cookie, they cannot modify it without the server's secret key. Any tampering is immediately detected.

### File Signature Verification

1. Generate an RSA key pair (2048-bit)
2. Sign a file with the private key
3. Verify the signature with the public key (succeeds)
4. Modify the file content
5. Verify the signature again (fails)

**Why This Matters**: Digital signatures prove that a file hasn't been modified since it was signed. If someone tampers with the file, the signature verification fails.

## Technical Details

### HMAC Security

**Constant-Time Comparison**: The system uses `crypto.timingSafeEqual()` to compare HMAC tags. This prevents timing attacks where attackers could guess the tag byte-by-byte based on how long comparison takes.

```typescript
// Vulnerable: timing attack possible
if (computedTag === receivedTag) { ... }

// Secure: constant time
crypto.timingSafeEqual(
  Buffer.from(computedTag),
  Buffer.from(receivedTag)
);
```

**Secret Key Management**: The server-side secret key is stored in the `JWT_SECRET` environment variable. This key is never transmitted to clients and is used only on the server.

### RSA Security

**Key Size**: The system uses 2048-bit RSA keys, which are considered secure for most applications. The security depends on the difficulty of factoring large numbers.

**Signature Algorithm**: Uses SHA-256 for hashing before signing. The hash is encrypted with the private key, and verification decrypts it with the public key.

**Key Storage**: Private keys are stored in the database in PEM format. In production, these should be encrypted at rest and protected with additional access controls.

## Test Suite

The system includes comprehensive unit tests for all cryptographic operations:

```bash
pnpm test
```

**Test Coverage:**
- HMAC generation and verification
- Tampering detection
- Expiration validation
- RSA key pair generation
- File signing and verification
- Hash calculation
- Signature rejection for tampered files
- Signature rejection with wrong keys

All 19 tests pass successfully.

## Running the Application

### Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

The application will be available at `http://localhost:3000`

### Production Build

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## Usage Guide

### Part A: Cookie Protection

1. Navigate to "Cookie Generation" from the home page
2. Enter a username and select a role
3. Click "Generate Cookie"
4. Copy the payload and HMAC tag
5. Switch to the "Verify & Tamper" tab
6. Click "Tamper with Payload" to modify the role
7. Click "Verify Cookie" to see the tampering detected

### Part B: Digital Signatures

1. Log in to the application
2. Navigate to "Key Generation" from the home page
3. Click "Generate Key Pair" to create RSA keys
4. Switch to "Sign File" tab
5. Select your key pair and enter file content
6. Click "Sign File"
7. Switch to "Verify Signature" tab
8. Select the signed file
9. Modify the content and click "Verify Signature" to see verification fail

## Security Concepts Explained

### Why HMAC Instead of Plain Hashing?

Plain hashing (e.g., SHA-256) is one-way but doesn't require a secret. An attacker can:
1. Modify a cookie
2. Compute the hash of the modified cookie
3. Replace the hash in the cookie

HMAC requires a secret key, so attackers cannot compute valid tags without it.

### Why RSA Instead of Symmetric Encryption?

Symmetric encryption (like AES) requires both parties to share a secret key. RSA allows:
- Signing with a private key (only the signer has)
- Verification with a public key (anyone can have)
- Non-repudiation (signer cannot deny signing)

### Timing Attacks

Without constant-time comparison, attackers could guess authentication tags byte-by-byte:
- First byte wrong: comparison fails immediately
- First byte right, second wrong: takes slightly longer
- All bytes right: takes longest

By using constant-time comparison, all comparisons take the same time regardless of where the mismatch is.

## Bonus: Attack Demonstrations

The `crypto.ts` file includes functions demonstrating two attacks:

### Key Substitution Attack

If an attacker can substitute the public key used for verification, they can make their own signatures appear valid:

```typescript
demonstrateKeySubstitutionAttack()
```

**Mitigation**: Use certificate authorities or key pinning to ensure you're using the correct public key.

### Message Key Substitution Attack

If the system doesn't properly track which key was used for which signature, attackers could mix and match:

```typescript
demonstrateMessageKeySubstitutionAttack()
```

**Mitigation**: Always maintain clear associations between files, signatures, and keys. Use digital certificates.

## References

- [HMAC - RFC 2104](https://tools.ietf.org/html/rfc2104)
- [RSA Cryptography - RFC 3447](https://tools.ietf.org/html/rfc3447)
- [NIST Guidelines on Cryptographic Algorithms](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-175B.pdf)
- [OWASP: Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)
- [Node.js Crypto Documentation](https://nodejs.org/api/crypto.html)

## Educational Purpose

This system is designed for educational purposes to demonstrate cryptographic concepts. It is not intended for production use. In production:

- Use established frameworks with security audits
- Implement additional security measures (HTTPS, CSRF tokens, rate limiting)
- Use hardware security modules for key storage
- Implement proper key rotation policies
- Use authenticated encryption (e.g., AES-GCM) instead of just HMAC
- Implement certificate pinning for public keys
- Use time-tested libraries like libsodium or OpenSSL

## License

Educational demonstration - use freely for learning purposes.
