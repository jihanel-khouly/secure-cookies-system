import crypto from "crypto";

/**
 * HMAC-SHA256 Cookie Protection Module
 * Provides secure cookie generation and verification using HMAC
 */

/**
 * Generate HMAC-SHA256 tag for cookie content
 * @param payload - The cookie payload (username, role, expiration)
 * @param secretKey - Server-side secret key (must be kept secure)
 * @returns Base64-encoded HMAC tag
 */
export function generateHMAC(payload: string, secretKey: string): string {
  const hmac = crypto.createHmac("sha256", secretKey);
  hmac.update(payload);
  return hmac.digest("base64");
}

/**
 * Verify HMAC tag matches the payload
 * @param payload - The cookie payload
 * @param receivedTag - The HMAC tag from the client
 * @param secretKey - Server-side secret key
 * @returns true if verification succeeds, false otherwise
 */
export function verifyHMAC(
  payload: string,
  receivedTag: string,
  secretKey: string
): boolean {
  const computedTag = generateHMAC(payload, secretKey);
  // Use constant-time comparison to prevent timing attacks
  return crypto.timingSafeEqual(
    Buffer.from(computedTag),
    Buffer.from(receivedTag)
  );
}

/**
 * Create a secure cookie object with HMAC protection
 * @param username - Username to store in cookie
 * @param role - User role (e.g., "user", "admin")
 * @param expirationMinutes - Cookie expiration time in minutes
 * @param secretKey - Server-side secret key
 * @returns Object containing payload and HMAC tag
 */
export function createSecureCookie(
  username: string,
  role: string,
  expirationMinutes: number,
  secretKey: string
) {
  // Create expiration timestamp
  const expirationTime = Date.now() + expirationMinutes * 60 * 1000;

  // Create cookie payload as JSON
  const payload = JSON.stringify({
    username,
    role,
    expiration: expirationTime,
  });

  // Generate HMAC tag
  const tag = generateHMAC(payload, secretKey);

  return {
    payload,
    tag,
    expirationTime,
  };
}

/**
 * Verify a secure cookie
 * @param payload - Cookie payload (JSON string)
 * @param tag - HMAC tag from cookie
 * @param secretKey - Server-side secret key
 * @returns Parsed cookie data if valid, null otherwise
 */
export function verifySecureCookie(
  payload: string,
  tag: string,
  secretKey: string
) {
  try {
    // First verify HMAC
    if (!verifyHMAC(payload, tag, secretKey)) {
      return null;
    }

    // Parse payload
    const cookieData = JSON.parse(payload);

    // Check expiration
    if (Date.now() > cookieData.expiration) {
      return null;
    }

    return cookieData;
  } catch (error) {
    return null;
  }
}

/**
 * RSA Digital Signature Module
 * Provides RSA key generation and digital signature operations
 */

/**
 * Generate RSA key pair for digital signatures
 * @param keySize - Key size in bits (2048, 4096, etc.)
 * @returns Object containing private and public keys in PEM format
 */
export function generateRSAKeyPair(keySize: number = 2048) {
  return new Promise<{
    privateKey: string;
    publicKey: string;
  }>((resolve, reject) => {
    crypto.generateKeyPair(
      "rsa",
      {
        modulusLength: keySize,
        publicKeyEncoding: {
          type: "spki",
          format: "pem",
        },
        privateKeyEncoding: {
          type: "pkcs8",
          format: "pem",
        },
      },
      (err, publicKey, privateKey) => {
        if (err) {
          reject(err);
        } else {
          resolve({
            privateKey,
            publicKey,
          });
        }
      }
    );
  });
}

/**
 * Sign file content using RSA private key with SHA-256
 * @param fileContent - File content as Buffer or string
 * @param privateKey - RSA private key in PEM format
 * @returns Base64-encoded signature
 */
export function signFile(
  fileContent: Buffer | string,
  privateKey: string
): string {
  const signer = crypto.createSign("sha256");
  signer.update(fileContent);
  const signature = signer.sign(privateKey);
  return signature.toString("base64");
}

/**
 * Verify file signature using RSA public key with SHA-256
 * @param fileContent - File content as Buffer or string
 * @param signature - Base64-encoded signature
 * @param publicKey - RSA public key in PEM format
 * @returns true if signature is valid, false otherwise
 */
export function verifySignature(
  fileContent: Buffer | string,
  signature: string,
  publicKey: string
): boolean {
  try {
    const verifier = crypto.createVerify("sha256");
    verifier.update(fileContent);
    const signatureBuffer = Buffer.from(signature, "base64");
    return verifier.verify(publicKey, signatureBuffer);
  } catch (error) {
    return false;
  }
}

/**
 * Calculate SHA-256 hash of file content
 * @param fileContent - File content as Buffer or string
 * @returns Hex-encoded SHA-256 hash
 */
export function calculateFileHash(fileContent: Buffer | string): string {
  const hash = crypto.createHash("sha256");
  hash.update(fileContent);
  return hash.digest("hex");
}

/**
 * Bonus: Key Substitution Attack
 * Demonstrates how an attacker could substitute the public key
 * This is a vulnerability if the public key is not properly authenticated
 */
export function demonstrateKeySubstitutionAttack() {
  // Generate two key pairs - one legitimate, one malicious
  return Promise.all([
    generateRSAKeyPair(2048),
    generateRSAKeyPair(2048),
  ]).then(([legitimateKeys, maliciousKeys]) => {
    // Attacker creates a file and signs it with their private key
    const fileContent = "Important document";
    const maliciousSignature = signFile(fileContent, maliciousKeys.privateKey);

    // If the system uses the attacker's public key instead of the legitimate one,
    // the signature will verify successfully even though it wasn't signed by the legitimate key holder
    const isValidWithMaliciousKey = verifySignature(
      fileContent,
      maliciousSignature,
      maliciousKeys.publicKey
    );

    // This would fail with the legitimate public key
    const isValidWithLegitimateKey = verifySignature(
      fileContent,
      maliciousSignature,
      legitimateKeys.publicKey
    );

    return {
      fileContent,
      maliciousSignature,
      isValidWithMaliciousKey, // true - vulnerability!
      isValidWithLegitimateKey, // false - as expected
      explanation:
        "If an attacker can substitute the public key used for verification, they can make their own signatures appear valid.",
    };
  });
}

/**
 * Bonus: Message Key Substitution Attack
 * Demonstrates how an attacker could create a collision between two different files
 * by using different keys and signatures
 */
export function demonstrateMessageKeySubstitutionAttack() {
  return Promise.all([
    generateRSAKeyPair(2048),
    generateRSAKeyPair(2048),
  ]).then(([key1, key2]) => {
    // Original file signed with key1
    const originalFile = "Transfer $100 to account A";
    const originalSignature = signFile(originalFile, key1.privateKey);

    // Attacker's file signed with key2
    const maliciousFile = "Transfer $1000 to account B";
    const maliciousSignature = signFile(maliciousFile, key2.privateKey);

    // If the system doesn't properly track which key was used for which signature,
    // an attacker could present the malicious file with the original signature
    // and claim it was signed with key2 (which they control)

    return {
      originalFile,
      originalSignature,
      maliciousFile,
      maliciousSignature,
      originalVerifiesWithKey1: verifySignature(
        originalFile,
        originalSignature,
        key1.publicKey
      ),
      maliciousVerifiesWithKey2: verifySignature(
        maliciousFile,
        maliciousSignature,
        key2.publicKey
      ),
      // This is the attack: if keys aren't properly associated with files
      maliciousVerifiesWithOriginalSignature: verifySignature(
        maliciousFile,
        originalSignature,
        key1.publicKey
      ),
      explanation:
        "If the system doesn't maintain a clear association between files, signatures, and keys, an attacker could mix and match them to create false validations.",
    };
  });
}
