import { describe, expect, it } from "vitest";
import {
  generateHMAC,
  verifyHMAC,
  createSecureCookie,
  verifySecureCookie,
  generateRSAKeyPair,
  signFile,
  verifySignature,
  calculateFileHash,
} from "./crypto";

describe("HMAC Cookie Protection", () => {
  const secretKey = "super-secret-server-key-12345";

  it("should generate valid HMAC tag", () => {
    const payload = "test-payload";
    const tag = generateHMAC(payload, secretKey);

    expect(tag).toBeTruthy();
    expect(typeof tag).toBe("string");
    // HMAC-SHA256 in base64 should be 44 characters
    expect(tag.length).toBeGreaterThan(0);
  });

  it("should verify correct HMAC tag", () => {
    const payload = "test-payload";
    const tag = generateHMAC(payload, secretKey);

    const isValid = verifyHMAC(payload, tag, secretKey);
    expect(isValid).toBe(true);
  });

  it("should reject tampered HMAC tag", () => {
    const payload = "test-payload";
    const tag = generateHMAC(payload, secretKey);
    const tamperedTag = tag.slice(0, -1) + (tag[tag.length - 1] === "A" ? "B" : "A");

    const isValid = verifyHMAC(payload, tamperedTag, secretKey);
    expect(isValid).toBe(false);
  });

  it("should reject HMAC with wrong secret key", () => {
    const payload = "test-payload";
    const tag = generateHMAC(payload, secretKey);
    const wrongKey = "different-secret-key";

    const isValid = verifyHMAC(payload, tag, wrongKey);
    expect(isValid).toBe(false);
  });

  it("should reject HMAC when payload is tampered", () => {
    const payload = "test-payload";
    const tag = generateHMAC(payload, secretKey);
    const tamperedPayload = "tampered-payload";

    const isValid = verifyHMAC(tamperedPayload, tag, secretKey);
    expect(isValid).toBe(false);
  });

  it("should create secure cookie with all required fields", () => {
    const username = "testuser";
    const role = "admin";
    const expirationMinutes = 60;

    const cookie = createSecureCookie(username, role, expirationMinutes, secretKey);

    expect(cookie.payload).toBeTruthy();
    expect(cookie.tag).toBeTruthy();
    expect(cookie.expirationTime).toBeGreaterThan(Date.now());

    const parsed = JSON.parse(cookie.payload);
    expect(parsed.username).toBe(username);
    expect(parsed.role).toBe(role);
  });

  it("should verify valid secure cookie", () => {
    const username = "testuser";
    const role = "user";
    const expirationMinutes = 60;

    const cookie = createSecureCookie(username, role, expirationMinutes, secretKey);
    const verified = verifySecureCookie(cookie.payload, cookie.tag, secretKey);

    expect(verified).not.toBeNull();
    expect(verified?.username).toBe(username);
    expect(verified?.role).toBe(role);
  });

  it("should reject cookie with tampered payload", () => {
    const username = "testuser";
    const role = "user";
    const expirationMinutes = 60;

    const cookie = createSecureCookie(username, role, expirationMinutes, secretKey);
    const tamperedPayload = JSON.stringify({
      username: "admin",
      role: "admin",
      expiration: cookie.expirationTime,
    });

    const verified = verifySecureCookie(tamperedPayload, cookie.tag, secretKey);
    expect(verified).toBeNull();
  });

  it("should reject expired cookie", async () => {
    const username = "testuser";
    const role = "user";
    const expirationMinutes = -1; // Already expired

    const cookie = createSecureCookie(username, role, expirationMinutes, secretKey);
    const verified = verifySecureCookie(cookie.payload, cookie.tag, secretKey);

    expect(verified).toBeNull();
  });
});

describe("RSA Digital Signatures", () => {
  it("should generate RSA key pair", async () => {
    const keyPair = await generateRSAKeyPair(2048);

    expect(keyPair.privateKey).toBeTruthy();
    expect(keyPair.publicKey).toBeTruthy();
    expect(keyPair.privateKey).toContain("PRIVATE KEY");
    expect(keyPair.publicKey).toContain("PUBLIC KEY");
  });

  it("should sign file with private key", async () => {
    const keyPair = await generateRSAKeyPair(2048);
    const fileContent = "Important document content";

    const signature = signFile(fileContent, keyPair.privateKey);

    expect(signature).toBeTruthy();
    expect(typeof signature).toBe("string");
    // Base64 encoded signature
    expect(signature.length).toBeGreaterThan(0);
  });

  it("should verify valid signature with public key", async () => {
    const keyPair = await generateRSAKeyPair(2048);
    const fileContent = "Important document content";

    const signature = signFile(fileContent, keyPair.privateKey);
    const isValid = verifySignature(fileContent, signature, keyPair.publicKey);

    expect(isValid).toBe(true);
  });

  it("should reject signature for tampered file", async () => {
    const keyPair = await generateRSAKeyPair(2048);
    const fileContent = "Important document content";
    const tamperedContent = "Tampered document content";

    const signature = signFile(fileContent, keyPair.privateKey);
    const isValid = verifySignature(tamperedContent, signature, keyPair.publicKey);

    expect(isValid).toBe(false);
  });

  it("should reject signature with wrong public key", async () => {
    const keyPair1 = await generateRSAKeyPair(2048);
    const keyPair2 = await generateRSAKeyPair(2048);
    const fileContent = "Important document content";

    const signature = signFile(fileContent, keyPair1.privateKey);
    const isValid = verifySignature(fileContent, signature, keyPair2.publicKey);

    expect(isValid).toBe(false);
  });

  it("should reject tampered signature", async () => {
    const keyPair = await generateRSAKeyPair(2048);
    const fileContent = "Important document content";

    const signature = signFile(fileContent, keyPair.privateKey);
    // Tamper with the signature by replacing first character
    const signatureBuffer = Buffer.from(signature, "base64");
    signatureBuffer[0] = (signatureBuffer[0] + 1) % 256;
    const tamperedSignature = signatureBuffer.toString("base64");

    const isValid = verifySignature(fileContent, tamperedSignature, keyPair.publicKey);

    expect(isValid).toBe(false);
  });

  it("should calculate file hash", () => {
    const fileContent = "Important document content";
    const hash = calculateFileHash(fileContent);

    expect(hash).toBeTruthy();
    expect(hash.length).toBe(64); // SHA-256 hex is 64 characters
  });

  it("should produce different hashes for different content", () => {
    const content1 = "Document 1";
    const content2 = "Document 2";

    const hash1 = calculateFileHash(content1);
    const hash2 = calculateFileHash(content2);

    expect(hash1).not.toBe(hash2);
  });

  it("should produce same hash for same content", () => {
    const content = "Document content";

    const hash1 = calculateFileHash(content);
    const hash2 = calculateFileHash(content);

    expect(hash1).toBe(hash2);
  });
});
