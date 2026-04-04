# Secure Cookies and Digital Signature System

A comprehensive educational web application demonstrating cryptographic security concepts including **HMAC-protected cookies** and **RSA digital signatures**. This system provides interactive demonstrations of how modern web applications protect data integrity and authenticity.

##  Project Overview

This application serves as an educational tool to understand two fundamental cryptographic mechanisms:

### Part A: HMAC-Protected Cookies
Learn how servers protect cookies from tampering using **Message Authentication Codes (HMAC)** combined with **SHA-256 hashing**. The system demonstrates how even tiny modifications to cookie content are immediately detected.

### Part B: RSA Digital Signatures
Explore asymmetric cryptography through **RSA key pairs** and **digital signatures**. Sign files with a private key and verify them with a public key, proving both authenticity and integrity.

## 📋 Table of Contents

- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Usage Guide](#usage-guide)
- [Security Concepts](#security-concepts)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Features

### Part A: HMAC-Protected Cookies

- **Cookie Generation**: Create HMAC-protected cookies with username, role, and expiration timestamp
- **HMAC-SHA256 Authentication**: Server-side MAC tag generation and verification
- **Expiration Validation**: Automatic rejection of expired cookies
- ** Tampering Detection**: Real-time detection of any cookie modifications
- ** Constant-Time Comparison**: Timing-safe verification to prevent timing attacks
- **Interactive Demo**: Visual demonstration of successful and failed verifications

### Part B: RSA Digital Signatures

- ** Key Pair Generation**: Create 2048-bit RSA key pairs
- **File Signing**: Sign files using SHA-256 hashing and RSA encryption
- **Signature Verification**: Verify file authenticity and detect modifications
- **Key Management**: Store and retrieve RSA key pairs per user
- ** File History**: Track all signed files with timestamps
- ** Educational Demonstrations**: See successful verification and tampering detection

### General Features

- **User Authentication**: Secure login with Manus OAuth
- ** Database Integration**: MySQL/TiDB backend with Drizzle ORM
- ** Comprehensive Testing**: 19 unit tests covering all cryptographic operations
- ** Security Documentation**: Detailed explanations of concepts and vulnerabilities
- **Clean UI**: Responsive design with Tailwind CSS and shadcn/ui components
- ** Type-Safe**: Full TypeScript implementation with end-to-end type safety

## Technology Stack

### Frontend
- **React 19**: Modern UI framework
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS 4**: Utility-first CSS framework
- **shadcn/ui**: High-quality React components
- **Wouter**: Lightweight routing
- **tRPC**: End-to-end type-safe APIs

### Backend
- **Express 4**: Web server framework
- **Node.js**: JavaScript runtime
- **tRPC 11**: Type-safe RPC framework
- **Drizzle ORM**: Type-safe database queries

### Database
- **MySQL/TiDB**: Relational database
- **Drizzle Kit**: Schema management and migrations

### Testing & Development
- **Vitest**: Fast unit testing framework
- **TypeScript**: Type checking
- **Vite**: Build tool and dev server

### Security
- **Node.js Crypto**: Built-in cryptographic functions
- **HMAC-SHA256**: Cookie authentication
- **RSA-2048**: Digital signatures
- **SHA-256**: File hashing

##  Project Structure

```
secure_cookies_system/
├── client/                          # React frontend
│   ├── public/                      # Static files
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.tsx            # Landing page
│   │   │   ├── CookieDemo.tsx      # HMAC cookie demonstration
│   │   │   └── SignatureDemo.tsx   # RSA signature demonstration
│   │   ├── components/
│   │   │   ├── ui/                 # shadcn/ui components
│   │   │   ├── DashboardLayout.tsx # Dashboard layout
│   │   │   └── ErrorBoundary.tsx   # Error handling
│   │   ├── contexts/               # React contexts
│   │   ├── hooks/                  # Custom hooks
│   │   ├── lib/
│   │   │   └── trpc.ts            # tRPC client setup
│   │   ├── App.tsx                # Main app component
│   │   ├── main.tsx               # Entry point
│   │   └── index.css              # Global styles
│   └── index.html
│
├── server/                          # Express backend
│   ├── _core/                       # Framework core (OAuth, context, etc.)
│   ├── crypto.ts                    # Cryptographic utilities
│   ├── crypto.test.ts              # Cryptographic tests
│   ├── db.ts                        # Database queries
│   ├── routers.ts                  # tRPC procedures
│   └── storage.ts                  # S3 storage helpers
│
├── drizzle/                         # Database schema
│   ├── schema.ts                   # Table definitions
│   └── migrations/                 # SQL migration files
│
├── shared/                          # Shared code
│   ├── const.ts                    # Constants
│   ├── types.ts                    # Shared types
│   └── _core/errors.ts             # Error definitions
│
├── storage/                         # S3 storage configuration
│
├── package.json                     # Dependencies and scripts
├── tsconfig.json                    # TypeScript configuration
├── vite.config.ts                   # Vite configuration
├── vitest.config.ts                 # Vitest configuration
├── SECURITY_README.md               # Detailed security documentation
└── todo.md                          # Project TODO list

```

##  Installation

### Prerequisites

- **Node.js** 18.0.0 or higher
- **pnpm** 10.0.0 or higher (or npm/yarn)
- **Git** for version control
- **MySQL** or **TiDB** database

### Step 1: Clone or Extract the Project

```bash
# If cloning from GitHub
git clone https://github.com/YOUR_USERNAME/secure-cookies-system.git
cd secure_cookies_system

# Or extract from ZIP
unzip secure_cookies_system.zip
cd secure_cookies_system
```

### Step 2: Install Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install

# Or using yarn
yarn install
```

### Step 3: Set Up Environment Variables

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Edit `.env` and configure:

```env
# Database
DATABASE_URL=mysql://user:password@localhost:3306/secure_cookies_db

# JWT Secret (use a strong random string)
JWT_SECRET=your-super-secret-key-here-min-32-chars

# OAuth Configuration (from Manus)
VITE_APP_ID=your-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://portal.manus.im

# Owner Information
OWNER_OPEN_ID=your-open-id
OWNER_NAME=Your Name

# Manus APIs
BUILT_IN_FORGE_API_URL=https://api.manus.im
BUILT_IN_FORGE_API_KEY=your-api-key
VITE_FRONTEND_FORGE_API_KEY=your-frontend-key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im

# Analytics (optional)
VITE_ANALYTICS_ENDPOINT=https://analytics.example.com
VITE_ANALYTICS_WEBSITE_ID=your-website-id

# App Configuration
VITE_APP_TITLE=Secure Cookies & Digital Signatures
VITE_APP_LOGO=https://example.com/logo.png
```

### Step 4: Set Up Database

```bash
# Generate migration files from schema
pnpm drizzle-kit generate

# Apply migrations
pnpm drizzle-kit migrate
```

Or if using the Manus platform, migrations are handled automatically.

##  Running the Application

### Development Mode

```bash
# Start development server with hot reload
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

### Run Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run specific test file
pnpm test server/crypto.test.ts
```

### Type Checking

```bash
# Check for TypeScript errors
pnpm check
```

### Code Formatting

```bash
# Format code with Prettier
pnpm format
```

## 📖 Usage Guide

### Part A: HMAC-Protected Cookies

#### 1. Generate a Cookie

1. Navigate to the home page
2. Click **"Cookie Generation"** under Part A
3. Enter:
   - **Username**: Your username (e.g., "alice")
   - **Role**: Select a role (user or admin)
   - **Expiration**: Set expiration time (e.g., 1 hour)
4. Click **"Generate Cookie"**
5. Copy the **Payload** and **HMAC Tag** shown

#### 2. Verify a Valid Cookie

1. Switch to the **"Verify & Tamper"** tab
2. Paste the payload and HMAC tag
3. Click **"Verify Cookie"**
4. See the success message: "✅ Cookie is valid and not expired"

#### 3. Demonstrate Tampering Detection

1. Click **"Tamper with Payload"** button
2. The role will change from "user" to "admin"
3. Click **"Verify Cookie"** again
4. See the error: "❌ HMAC verification failed - Cookie has been tampered with"

**Why This Matters**: Even though the attacker modified the payload, the HMAC tag no longer matches. The server immediately detects the tampering because it knows the secret key used to generate the original tag.

### Part B: RSA Digital Signatures

#### 1. Generate RSA Key Pair

1. Log in to the application
2. Navigate to **"Key Generation"** under Part B
3. Click **"Generate Key Pair"**
4. Wait for the 2048-bit RSA key pair to be generated
5. Your key pair is now stored and ready to use

#### 2. Sign a File

1. Switch to the **"Sign File"** tab
2. Select your key pair from the dropdown
3. Enter:
   - **Filename**: Name of the file (e.g., "document.txt")
   - **File Content**: The content to sign
4. Click **"Sign File"**
5. Copy the **Digital Signature** shown

#### 3. Verify File Signature

1. Switch to the **"Verify Signature"** tab
2. Select a previously signed file
3. The original content is shown
4. Click **"Verify Signature"**
5. See the success: "✅ Signature Verified - File Authentic"

#### 4. Detect File Modification

1. In the **"Verify Signature"** tab
2. Select a signed file
3. **Modify the file content** (change a few words)
4. Click **"Verify Signature"**
5. See the error: "❌ Signature Verification Failed - File Modified"

**Why This Matters**: The signature is based on the original file's hash. Any modification changes the hash, making the signature invalid. This proves the file hasn't been modified since it was signed.

##  Security Concepts

### HMAC (Hash-Based Message Authentication Code)

**What is it?**
HMAC combines a cryptographic hash function (SHA-256) with a secret key to create an authentication tag. Only someone with the secret key can create a valid tag.

**How it works:**
```
HMAC = Hash(secret_key + message + secret_key)
```

**Security properties:**
- **Integrity**: Detects any modification to the message
- **Authenticity**: Proves the message came from someone with the secret key
- **Non-forgeable**: Attackers cannot create valid tags without the secret key

**Why constant-time comparison?**
Without constant-time comparison, attackers could guess the tag byte-by-byte:
- Wrong first byte: Fails immediately
- Correct first byte, wrong second: Takes slightly longer
- All bytes correct: Takes longest

By using constant-time comparison, all comparisons take the same time, preventing timing attacks.

### RSA (Rivest-Shamir-Adleman)

**What is it?**
RSA is an asymmetric cryptography algorithm using a pair of mathematically related keys:
- **Private Key**: Kept secret, used for signing
- **Public Key**: Shared openly, used for verification

**How digital signatures work:**
1. Hash the file content (SHA-256)
2. Encrypt the hash with the private key (creates signature)
3. Anyone with the public key can decrypt the signature
4. If the decrypted hash matches the file's hash, the signature is valid

**Security properties:**
- **Authenticity**: Only the private key holder could have created the signature
- **Integrity**: Any modification to the file changes its hash, invalidating the signature
- **Non-repudiation**: The signer cannot deny having signed the document

**Key size:**
- 2048-bit RSA: Secure for most applications, ~112-bit security strength
- 4096-bit RSA: Higher security, slower operations
- Current recommendation: 2048-bit minimum, 4096-bit for long-term security

### Timing Attacks

**What is it?**
An attack that measures how long cryptographic operations take to guess secrets.

**Example:**
```
// Vulnerable code
if (computedTag === receivedTag) { ... }
```

If the comparison stops at the first mismatch, an attacker can:
1. Try all possible first bytes
2. Measure which one takes longest (means it's correct)
3. Move to the second byte
4. Repeat until the entire tag is guessed

**Prevention:**
```
// Secure code
crypto.timingSafeEqual(
  Buffer.from(computedTag),
  Buffer.from(receivedTag)
)
```

This compares all bytes regardless of where the mismatch is, taking constant time.

## 🔌 API Documentation

### tRPC Procedures

All API calls are type-safe through tRPC. The frontend automatically gets TypeScript types for all backend procedures.

#### Cookie Procedures

**Generate Cookie**
```typescript
trpc.cookies.generateSecureCookie.useQuery({
  username: string;
  role: "user" | "admin";
  expirationMinutes: number;
})
```

Returns:
```typescript
{
  payload: string;      // Base64 encoded payload
  hmacTag: string;      // Hex encoded HMAC tag
  expiresAt: Date;      // Expiration timestamp
}
```

**Verify Cookie**
```typescript
trpc.cookies.verifySecureCookie.useQuery({
  payload: string;      // Base64 encoded payload
  hmacTag: string;      // Hex encoded HMAC tag
})
```

Returns:
```typescript
{
  isValid: boolean;
  username?: string;
  role?: "user" | "admin";
  expiresAt?: Date;
  error?: string;
}
```

#### Signature Procedures

**Generate Key Pair**
```typescript
trpc.signatures.generateKeyPair.useMutation({
  keySize: 2048 | 4096;
})
```

**Get Key Pairs**
```typescript
trpc.signatures.getKeyPairs.useQuery()
```

Returns:
```typescript
{
  id: number;
  keySize: number;
  publicKey: string;    // PEM format
  generatedAt: Date;
}[]
```

**Sign File**
```typescript
trpc.signatures.signFile.useMutation({
  filename: string;
  fileContent: string;
  keyPairId: number;
})
```

Returns:
```typescript
{
  signature: string;    // Base64 encoded
  fileHash: string;     // Hex encoded SHA-256
  filename: string;
  signedAt: Date;
}
```

**Verify Signature**
```typescript
trpc.signatures.verifyFileSignature.useQuery({
  fileId: number;
  fileContent: string;
})
```

Returns:
```typescript
{
  isValid: boolean;
  hashMatches: boolean;
  originalHash: string;
  currentHash: string;
  filename: string;
}
```

##  Testing

The project includes comprehensive unit tests for all cryptographic operations.

### Test Coverage

```
✓ Authentication Tests (1 test)
  - auth.logout

✓ Cryptographic Tests (18 tests)
  - HMAC Generation and Verification
  - Cookie Tampering Detection
  - Cookie Expiration Validation
  - RSA Key Pair Generation
  - File Signing and Verification
  - Hash Calculation
  - Signature Rejection for Tampered Files
  - Signature Rejection with Wrong Keys
```

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test --watch

# Run specific test file
pnpm test server/crypto.test.ts

# Run with coverage
pnpm test --coverage
```

### Test Examples

**HMAC Test:**
```typescript
it("should verify valid HMAC", () => {
  const payload = { username: "alice", role: "user" };
  const { hmacTag } = createSecureCookie(payload, 60);
  const result = verifySecureCookie(payload, hmacTag);
  expect(result.isValid).toBe(true);
});
```

**RSA Test:**
```typescript
it("should verify valid signature", async () => {
  const { privateKey, publicKey } = await generateRSAKeyPair(2048);
  const fileContent = "test document";
  const signature = signFile(fileContent, privateKey);
  const isValid = verifySignature(fileContent, signature, publicKey);
  expect(isValid).toBe(true);
});
```

##  Deployment

### Deploy to Manus Platform

The project is built on the Manus platform and can be deployed with one click:

1. Create a checkpoint (already done)
2. Click the **"Publish"** button in the Management UI
3. Your app will be deployed to `https://your-project.manus.space`

### Deploy to GitHub Pages (Documentation)

```bash
# Build documentation
pnpm build

# Push to GitHub
git push origin main
```

### Deploy to Other Platforms

#### Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login to Railway
railway login

# Deploy
railway up
```

#### Render
```bash
# Connect your GitHub repository to Render
# Push code to GitHub
git push origin main

# Render will automatically deploy
```

#### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

See [GITHUB_DEPLOYMENT_GUIDE.md](./GITHUB_DEPLOYMENT_GUIDE.md) for detailed GitHub setup instructions.

##  Troubleshooting

### Issue: "Cannot find module 'crypto'"

**Solution**: Make sure you're running Node.js 18+
```bash
node --version  # Should be v18.0.0 or higher
```

### Issue: "Database connection failed"

**Solution**: Check your `DATABASE_URL` in `.env`
```bash
# Test connection
mysql -u user -p -h localhost -D database_name
```

### Issue: "HMAC verification failed" in tests

**Solution**: Make sure the secret key is consistent
```typescript
// Both generation and verification must use the same secret
const secret = process.env.JWT_SECRET;
```

### Issue: "RSA key generation is slow"

**Solution**: This is normal for 2048-bit keys. For development, you can:
- Use 1024-bit keys (not recommended for production)
- Cache generated keys
- Generate keys asynchronously

### Issue: "Port 3000 already in use"

**Solution**: Use a different port
```bash
PORT=3001 pnpm dev
```

### Issue: "TypeScript compilation errors"

**Solution**: Run type checking and fix errors
```bash
pnpm check
# Fix any errors shown
```

### Issue: "Tests failing randomly"

**Solution**: Make sure tests are isolated and don't share state
```bash
# Run tests sequentially
pnpm test --run --reporter=verbose
```

##  Additional Resources

### Documentation
- [SECURITY_README.md](./SECURITY_README.md) - Detailed security concepts
- [GITHUB_DEPLOYMENT_GUIDE.md](./GITHUB_DEPLOYMENT_GUIDE.md) - GitHub setup instructions
- [Node.js Crypto Documentation](https://nodejs.org/api/crypto.html)

### References
- [HMAC - RFC 2104](https://tools.ietf.org/html/rfc2104)
- [RSA Cryptography - RFC 3447](https://tools.ietf.org/html/rfc3447)
- [NIST Cryptographic Algorithm Guidelines](https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-175B.pdf)
- [OWASP Cryptographic Storage Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Cryptographic_Storage_Cheat_Sheet.html)

### Learning Resources
- [Cryptography Basics - Khan Academy](https://www.khanacademy.org/computing/computer-science/cryptography)
- [RSA Encryption - 3Blue1Brown](https://www.youtube.com/watch?v=4zahVFkwtBM)
- [HMAC Explained - Computerphile](https://www.youtube.com/watch?v=wlSG3pEiQdc)

##  Contributing

Contributions are welcome! Here's how to contribute:

1. **Fork the repository** on GitHub
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```
3. **Make your changes** and commit:
   ```bash
   git commit -m "Add your feature description"
   ```
4. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```
5. **Create a Pull Request** on GitHub
6. **Wait for review** and address any feedback

### Development Guidelines

- Follow the existing code style
- Add tests for new features
- Update documentation
- Use descriptive commit messages
- Keep commits focused and atomic

##  License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

### MIT License Summary

You are free to:
- Use this software for any purpose
-  Copy and modify the software
-  Distribute the software

With the condition that:
-  Include the original license and copyright notice

## 👨‍💻 Author

**Secure Cookies System Contributors**

This is an educational project demonstrating cryptographic concepts. It was created to help developers understand how modern web applications protect data integrity and authenticity.

## FAQ

**Q: Is this production-ready?**
A: No, this is an educational demonstration. For production use, implement additional security measures like HTTPS, CSRF tokens, rate limiting, and use battle-tested cryptographic libraries.

**Q: Can I use this code in my project?**
A: Yes! The MIT License allows you to use, modify, and distribute the code. Just include the license notice.

**Q: Why 2048-bit RSA instead of 4096-bit?**
A: 2048-bit is secure for most applications and faster to generate. 4096-bit provides more security but slower operations. Choose based on your security requirements.

**Q: How do I report security issues?**
A: Since this is educational software, please report issues through GitHub Issues. For production systems, use responsible disclosure practices.

**Q: Can I contribute improvements?**
A: Absolutely! Submit pull requests with improvements, bug fixes, or additional educational demonstrations.

---

**Happy learning!  Explore cryptography through hands-on demonstrations.**

For questions or issues, open a GitHub issue or refer to the detailed documentation in SECURITY_README.md.
