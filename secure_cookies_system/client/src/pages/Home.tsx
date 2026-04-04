import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "wouter";
import { Lock, Key, Shield, AlertCircle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900">
              Secure Cookies & Digital Signatures
            </h1>
          </div>
          <p className="text-slate-600">
            Cryptographic demonstrations for authentication and data integrity
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Introduction */}
        <div className="mb-12 bg-white rounded-lg border border-slate-200 p-8">
          <h2 className="text-2xl font-semibold mb-4 text-slate-900">
            System Overview
          </h2>
          <p className="text-slate-700 mb-4">
            This application demonstrates two critical security concepts in modern cryptography:
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-semibold text-slate-900 mb-2">
                Part A: HMAC-Protected Cookies
              </h3>
              <p className="text-slate-600 text-sm">
                Learn how Message Authentication Codes (HMAC) protect cookies from tampering.
                The server maintains a secret key that generates authentication tags, ensuring
                any modification to cookie content is immediately detected.
              </p>
            </div>
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-semibold text-slate-900 mb-2">
                Part B: RSA Digital Signatures
              </h3>
              <p className="text-slate-600 text-sm">
                Explore asymmetric cryptography through RSA key pairs and digital signatures.
                Files are signed with a private key and verified with a public key, proving
                both authenticity and integrity.
              </p>
            </div>
          </div>
        </div>

        {/* Part A: Cookie Protection */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-semibold text-slate-900">
              Part A: HMAC-Protected Cookies
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Cookie Generation Demo */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-blue-500" />
                  Cookie Generation
                </CardTitle>
                <CardDescription>
                  Generate HMAC-protected cookies with user credentials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-4">
                  Create a secure cookie containing username, role, and expiration timestamp.
                  The server generates an HMAC-SHA256 authentication tag that proves the
                  cookie hasn't been modified.
                </p>
                <Link href="/cookies/generate">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700">
                    Try Cookie Generation
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Cookie Tampering Demo */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  Tampering Detection
                </CardTitle>
                <CardDescription>
                  See how tampering is detected and rejected
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-4">
                  Manually modify a cookie using browser tools and watch the server reject it.
                  Even tiny changes to the payload invalidate the HMAC tag, proving the
                  cookie was tampered with.
                </p>
                <Link href="/cookies/tampering">
                  <Button className="w-full bg-red-600 hover:bg-red-700">
                    Demonstrate Tampering
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Part B: Digital Signatures */}
        <section className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <Key className="w-6 h-6 text-green-600" />
            <h2 className="text-2xl font-semibold text-slate-900">
              Part B: RSA Digital Signatures
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Key Generation Demo */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-green-500" />
                  Key Generation
                </CardTitle>
                <CardDescription>
                  Generate RSA key pairs for digital signatures
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-4">
                  Generate a 2048-bit RSA key pair consisting of a private key (kept secret)
                  and a public key (shared for verification). These keys enable asymmetric
                  cryptography operations.
                </p>
                <Link href="/signatures/keygen">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Generate Key Pair
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* File Signing Demo */}
            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-green-500" />
                  File Signing
                </CardTitle>
                <CardDescription>
                  Sign files and verify their authenticity
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-slate-600 mb-4">
                  Upload or create a file, sign it with your private key, and verify it with
                  the public key. Modify the file after signing to see verification fail,
                  proving the file hasn't been tampered with.
                </p>
                <Link href="/signatures/sign">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    Sign & Verify Files
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Key Concepts */}
        <section className="bg-white rounded-lg border border-slate-200 p-8">
          <h2 className="text-2xl font-semibold mb-6 text-slate-900">
            Key Security Concepts
          </h2>

          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-bold">
                  1
                </span>
                HMAC (Hash-based MAC)
              </h3>
              <p className="text-sm text-slate-600">
                Uses a secret key with a hash function to create authentication tags. Only the
                server knows the key, making it impossible to forge valid tags.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-green-100 text-green-700 flex items-center justify-center text-sm font-bold">
                  2
                </span>
                RSA Signatures
              </h3>
              <p className="text-sm text-slate-600">
                Uses asymmetric key pairs where the private key signs and the public key
                verifies. Proves both authenticity and non-repudiation.
              </p>
            </div>

            <div>
              <h3 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center text-sm font-bold">
                  3
                </span>
                Integrity Verification
              </h3>
              <p className="text-sm text-slate-600">
                Both mechanisms detect any modification to protected data. Even a single bit
                change invalidates the authentication tag or signature.
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-slate-600 text-sm">
          <p>
            Educational demonstration of cryptographic security concepts. Not for production use.
          </p>
        </div>
      </footer>
    </div>
  );
}
