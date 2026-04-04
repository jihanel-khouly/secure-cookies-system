import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, longtext } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Table for storing RSA key pairs for digital signatures
export const rsaKeyPairs = mysqlTable("rsa_key_pairs", {
  id: int("id").autoincrement().primaryKey(),
  // User ID who owns this key pair
  userId: int("user_id").notNull(),
  // PEM-formatted private key (stored securely on server)
  privateKey: longtext("private_key").notNull(),
  // PEM-formatted public key (can be shared for verification)
  publicKey: longtext("public_key").notNull(),
  // Key size in bits (e.g., 2048, 4096)
  keySize: int("key_size").notNull(),
  // Timestamp when key pair was generated
  generatedAt: timestamp("generated_at").defaultNow().notNull(),
});

export type RSAKeyPair = typeof rsaKeyPairs.$inferSelect;
export type InsertRSAKeyPair = typeof rsaKeyPairs.$inferInsert;

// Table for storing signed files and their signatures
export const signedFiles = mysqlTable("signed_files", {
  id: int("id").autoincrement().primaryKey(),
  // User ID who signed this file
  userId: int("user_id").notNull(),
  // ID of the RSA key pair used for signing
  keyPairId: int("key_pair_id").notNull(),
  // Original filename
  filename: varchar("filename", { length: 255 }).notNull(),
  // File content (base64 encoded for storage)
  fileContent: longtext("file_content").notNull(),
  // Digital signature (base64 encoded)
  signature: longtext("signature").notNull(),
  // SHA-256 hash of the original file
  fileHash: varchar("file_hash", { length: 64 }).notNull(),
  // Timestamp when file was signed
  signedAt: timestamp("signed_at").defaultNow().notNull(),
});

export type SignedFile = typeof signedFiles.$inferSelect;
export type InsertSignedFile = typeof signedFiles.$inferInsert;