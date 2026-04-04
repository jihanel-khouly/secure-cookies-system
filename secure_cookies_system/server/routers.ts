import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
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
import {
  createRSAKeyPair,
  getUserRSAKeyPairs,
  getRSAKeyPairById,
  createSignedFile,
  getUserSignedFiles,
  getSignedFileById,
} from "./db";

export const appRouter = router({
  // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Part A: Cookie Protection with HMAC
  cookies: router({
    // Generate a secure cookie with HMAC protection
    generateSecureCookie: publicProcedure
      .input(
        z.object({
          username: z.string(),
          role: z.string(),
          expirationMinutes: z.number().default(60),
        })
      )
      .mutation(async ({ input }) => {
        const secretKey = process.env.JWT_SECRET || "default-secret-key";
        const cookie = createSecureCookie(
          input.username,
          input.role,
          input.expirationMinutes,
          secretKey
        );
        return cookie;
      }),

    // Verify a secure cookie
    verifySecureCookie: publicProcedure
      .input(
        z.object({
          payload: z.string(),
          tag: z.string(),
        })
      )
      .query(({ input }) => {
        const secretKey = process.env.JWT_SECRET || "default-secret-key";
        const result = verifySecureCookie(input.payload, input.tag, secretKey);
        return {
          isValid: result !== null,
          data: result,
        };
      }),
  }),

  // Part B: RSA Digital Signatures
  signatures: router({
    // Generate RSA key pair
    generateKeyPair: protectedProcedure
      .input(
        z.object({
          keySize: z.number().default(2048),
        })
      )
      .mutation(async ({ input, ctx }) => {
        const keyPair = await generateRSAKeyPair(input.keySize);
        // Store in database
        await createRSAKeyPair(
          ctx.user.id,
          keyPair.privateKey,
          keyPair.publicKey,
          input.keySize
        );
        return {
          success: true,
          publicKey: keyPair.publicKey,
          keySize: input.keySize,
        };
      }),

    // Get user's RSA key pairs
    getKeyPairs: protectedProcedure.query(async ({ ctx }) => {
      const keyPairs = await getUserRSAKeyPairs(ctx.user.id);
      return keyPairs.map((kp) => ({
        id: kp.id,
        keySize: kp.keySize,
        generatedAt: kp.generatedAt,
        publicKey: kp.publicKey,
      }));
    }),

    // Sign a file
    signFile: protectedProcedure
      .input(
        z.object({
          filename: z.string(),
          fileContent: z.string(),
          keyPairId: z.number(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        // Get the key pair
        const keyPair = await getRSAKeyPairById(input.keyPairId);
        if (!keyPair || keyPair.userId !== ctx.user.id) {
          throw new Error("Key pair not found or unauthorized");
        }

        // Sign the file
        const signature = signFile(input.fileContent, keyPair.privateKey);
        const fileHash = calculateFileHash(input.fileContent);

        // Store in database
        await createSignedFile(
          ctx.user.id,
          input.keyPairId,
          input.filename,
          input.fileContent,
          signature,
          fileHash
        );

        return {
          success: true,
          signature,
          fileHash,
        };
      }),

    // Get user's signed files
    getSignedFiles: protectedProcedure.query(async ({ ctx }) => {
      const files = await getUserSignedFiles(ctx.user.id);
      return files.map((f) => ({
        id: f.id,
        filename: f.filename,
        fileHash: f.fileHash,
        signedAt: f.signedAt,
        keyPairId: f.keyPairId,
      }));
    }),

    // Verify a file signature
    verifyFileSignature: protectedProcedure
      .input(
        z.object({
          fileId: z.number(),
          fileContent: z.string(),
        })
      )
      .query(async ({ input, ctx }) => {
        const file = await getSignedFileById(input.fileId);
        if (!file || file.userId !== ctx.user.id) {
          throw new Error("File not found or unauthorized");
        }

        const keyPair = await getRSAKeyPairById(file.keyPairId);
        if (!keyPair) {
          throw new Error("Key pair not found");
        }

        // Verify the signature
        const isValid = verifySignature(
          input.fileContent,
          file.signature,
          keyPair.publicKey
        );
        const currentHash = calculateFileHash(input.fileContent);
        const hashMatches = currentHash === file.fileHash;

        return {
          isValid,
          hashMatches,
          originalHash: file.fileHash,
          currentHash,
          filename: file.filename,
        };
      }),

    // Get a specific signed file
    getSignedFile: protectedProcedure
      .input(
        z.object({
          fileId: z.number(),
        })
      )
      .query(async ({ input, ctx }) => {
        const file = await getSignedFileById(input.fileId);
        if (!file || file.userId !== ctx.user.id) {
          throw new Error("File not found or unauthorized");
        }

        const keyPair = await getRSAKeyPairById(file.keyPairId);
        return {
          id: file.id,
          filename: file.filename,
          fileContent: file.fileContent,
          signature: file.signature,
          fileHash: file.fileHash,
          signedAt: file.signedAt,
          publicKey: keyPair?.publicKey,
        };
      }),
  }),
});

export type AppRouter = typeof appRouter;
