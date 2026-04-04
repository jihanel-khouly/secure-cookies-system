import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { AlertCircle, CheckCircle, Copy, Lock } from "lucide-react";
import { Link } from "wouter";

export default function CookieDemo() {
  const [username, setUsername] = useState("alice");
  const [role, setRole] = useState("user");
  const [expirationMinutes, setExpirationMinutes] = useState("60");
  const [generatedCookie, setGeneratedCookie] = useState<any>(null);
  const [verificationPayload, setVerificationPayload] = useState("");
  const [verificationTag, setVerificationTag] = useState("");
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // tRPC mutations and queries
  const generateMutation = trpc.cookies.generateSecureCookie.useMutation();
  const verifyQuery = trpc.cookies.verifySecureCookie.useQuery(
    { payload: verificationPayload, tag: verificationTag },
    { enabled: false }
  );

  // Generate secure cookie
  const generateCookie = async () => {
    try {
      const result = await generateMutation.mutateAsync({
        username,
        role,
        expirationMinutes: parseInt(expirationMinutes),
      });
      setGeneratedCookie(result);
      setVerificationPayload(result.payload);
      setVerificationTag(result.tag);
    } catch (error) {
      console.error("Error generating cookie:", error);
    }
  };

  // Verify cookie
  const verifyCookie = async () => {
    try {
      const result = await verifyQuery.refetch();
      if (result.data) {
        setVerificationResult(result.data);
      }
    } catch (error) {
      console.error("Error verifying cookie:", error);
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Tamper with payload
  const tamperPayload = () => {
    try {
      const parsed = JSON.parse(verificationPayload);
      parsed.role = "admin"; // Change role to admin
      setVerificationPayload(JSON.stringify(parsed));
      setVerificationResult(null);
    } catch (error) {
      alert("Invalid JSON payload");
    }
  };

  // Tamper with tag
  const tamperTag = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    let tampered = "";
    for (let i = 0; i < verificationTag.length; i++) {
      if (i === Math.floor(verificationTag.length / 2)) {
        // Change middle character
        const currentChar = verificationTag[i];
        const currentIndex = chars.indexOf(currentChar);
        tampered += chars[(currentIndex + 1) % chars.length];
      } else {
        tampered += verificationTag[i];
      }
    }
    setVerificationTag(tampered);
    setVerificationResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="outline" className="mb-4">
              ← Back to Home
            </Button>
          </Link>
          <div className="flex items-center gap-3 mb-2">
            <Lock className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-slate-900">
              HMAC-Protected Cookies
            </h1>
          </div>
          <p className="text-slate-600">
            Demonstrate secure cookie generation, verification, and tampering detection
          </p>
        </div>

        <Tabs defaultValue="generate" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="generate">Generate Cookie</TabsTrigger>
            <TabsTrigger value="verify">Verify & Tamper</TabsTrigger>
          </TabsList>

          {/* Generate Tab */}
          <TabsContent value="generate" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Generate Secure Cookie</CardTitle>
                <CardDescription>
                  Create a cookie with HMAC-SHA256 protection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter username"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="role">Role</Label>
                    <Select value={role} onValueChange={setRole}>
                      <SelectTrigger id="role">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="user">User</SelectItem>
                        <SelectItem value="admin">Admin</SelectItem>
                        <SelectItem value="moderator">Moderator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="expiration">Expiration (minutes)</Label>
                  <Input
                    id="expiration"
                    type="number"
                    value={expirationMinutes}
                    onChange={(e) => setExpirationMinutes(e.target.value)}
                    min="1"
                    max="1440"
                  />
                </div>

                <Button onClick={generateCookie} className="w-full bg-blue-600 hover:bg-blue-700">
                  Generate Cookie
                </Button>
              </CardContent>
            </Card>

            {/* Generated Cookie Display */}
            {generatedCookie && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-900">
                    <CheckCircle className="w-5 h-5" />
                    Cookie Generated Successfully
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert className="bg-green-100 border-green-300">
                    <AlertCircle className="h-4 w-4 text-green-700" />
                    <AlertTitle className="text-green-900">How It Works</AlertTitle>
                    <AlertDescription className="text-green-800 text-sm">
                      The server generated a cookie payload and computed an HMAC-SHA256 authentication tag
                      using a secret key. This tag proves the cookie hasn't been tampered with. Only the
                      server knows the secret key, making it impossible for clients to forge valid tags.
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-3">
                    <div className="bg-white p-4 rounded border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <label className="font-semibold text-slate-900">Cookie Payload (JSON)</label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(generatedCookie.payload, "payload")}
                        >
                          <Copy className="w-4 h-4" />
                          {copiedField === "payload" ? "Copied!" : "Copy"}
                        </Button>
                      </div>
                      <code className="text-xs bg-slate-100 p-3 rounded block overflow-x-auto text-slate-700">
                        {JSON.stringify(JSON.parse(generatedCookie.payload), null, 2)}
                      </code>
                    </div>

                    <div className="bg-white p-4 rounded border border-slate-200">
                      <div className="flex items-center justify-between mb-2">
                        <label className="font-semibold text-slate-900">HMAC-SHA256 Tag</label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(generatedCookie.tag, "tag")}
                        >
                          <Copy className="w-4 h-4" />
                          {copiedField === "tag" ? "Copied!" : "Copy"}
                        </Button>
                      </div>
                      <code className="text-xs bg-slate-100 p-3 rounded block overflow-x-auto text-slate-700 break-all">
                        {generatedCookie.tag}
                      </code>
                    </div>

                    <div className="bg-blue-50 p-4 rounded border border-blue-200">
                      <p className="text-sm text-slate-700">
                        <strong>Expiration Timestamp:</strong>{" "}
                        {new Date(generatedCookie.expirationTime).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Verify Tab */}
          <TabsContent value="verify" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Verify Cookie & Test Tampering</CardTitle>
                <CardDescription>
                  Verify a cookie's authenticity or modify it to see tampering detection
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertCircle className="h-4 w-4 text-blue-700" />
                  <AlertTitle className="text-blue-900">Try This:</AlertTitle>
                  <AlertDescription className="text-blue-800 text-sm">
                    Generate a cookie first, then try the "Tamper with Payload" or "Tamper with Tag"
                    buttons below. When you verify the tampered cookie, the server will reject it
                    because the HMAC tag no longer matches the payload.
                  </AlertDescription>
                </Alert>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="payload">Cookie Payload</Label>
                    <textarea
                      id="payload"
                      value={verificationPayload}
                      onChange={(e) => setVerificationPayload(e.target.value)}
                      className="w-full h-24 p-3 border border-slate-300 rounded font-mono text-xs"
                      placeholder="Paste cookie payload here"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tag">HMAC Tag</Label>
                    <textarea
                      id="tag"
                      value={verificationTag}
                      onChange={(e) => setVerificationTag(e.target.value)}
                      className="w-full h-20 p-3 border border-slate-300 rounded font-mono text-xs"
                      placeholder="Paste HMAC tag here"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <Button
                    onClick={tamperPayload}
                    variant="outline"
                    className="border-orange-300 text-orange-700 hover:bg-orange-50"
                  >
                    Tamper with Payload
                  </Button>
                  <Button
                    onClick={tamperTag}
                    variant="outline"
                    className="border-orange-300 text-orange-700 hover:bg-orange-50"
                  >
                    Tamper with Tag
                  </Button>
                </div>

                <Button onClick={verifyCookie} className="w-full bg-blue-600 hover:bg-blue-700">
                  Verify Cookie
                </Button>
              </CardContent>
            </Card>

            {/* Verification Result */}
            {verificationResult && (
              <Card
                className={
                  verificationResult.isValid
                    ? "border-green-200 bg-green-50"
                    : "border-red-200 bg-red-50"
                }
              >
                <CardHeader>
                  <CardTitle
                    className={
                      verificationResult.isValid
                        ? "flex items-center gap-2 text-green-900"
                        : "flex items-center gap-2 text-red-900"
                    }
                  >
                    {verificationResult.isValid ? (
                      <>
                        <CheckCircle className="w-5 h-5" />
                        Cookie Verified Successfully
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5" />
                        Cookie Verification Failed
                      </>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {verificationResult.isValid ? (
                    <Alert className="bg-green-100 border-green-300">
                      <CheckCircle className="h-4 w-4 text-green-700" />
                      <AlertTitle className="text-green-900">Valid Cookie</AlertTitle>
                      <AlertDescription className="text-green-800 text-sm">
                        The HMAC tag matches the payload. The cookie hasn't been tampered with
                        and is still valid.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert className="bg-red-100 border-red-300">
                      <AlertCircle className="h-4 w-4 text-red-700" />
                      <AlertTitle className="text-red-900">Invalid Cookie</AlertTitle>
                      <AlertDescription className="text-red-800 text-sm">
                        The HMAC tag does not match the payload. Either the payload or tag has
                        been modified, or the cookie has expired. The server rejects this cookie.
                      </AlertDescription>
                    </Alert>
                  )}

                  {verificationResult.data && (
                    <div className="bg-white p-4 rounded border border-slate-200">
                      <p className="font-semibold text-slate-900 mb-2">Cookie Data:</p>
                      <code className="text-xs bg-slate-100 p-3 rounded block overflow-x-auto text-slate-700">
                        {JSON.stringify(verificationResult.data, null, 2)}
                      </code>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Security Explanation */}
        <Card className="mt-8 bg-slate-50 border-slate-200">
          <CardHeader>
            <CardTitle>Security Explanation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-slate-700">
            <div>
              <h4 className="font-semibold text-slate-900 mb-2">What is HMAC?</h4>
              <p>
                HMAC (Hash-based Message Authentication Code) combines a hash function (SHA-256)
                with a secret key to create an authentication tag. Only someone with the secret
                key can generate a valid tag for any given message.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Why Use HMAC for Cookies?</h4>
              <p>
                Cookies travel between client and server with every request. HMAC ensures that
                even if an attacker modifies a cookie, the server will detect it because they
                cannot generate a valid HMAC tag without the secret key.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-2">How Tampering is Detected</h4>
              <p>
                The server recomputes the HMAC tag for the received payload and compares it with
                the tag sent by the client. If they don't match (due to tampering), the cookie
                is rejected. Even changing a single character in the payload completely changes
                the HMAC tag.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Constant-Time Comparison</h4>
              <p>
                The server uses constant-time comparison to prevent timing attacks. This ensures
                that the comparison takes the same amount of time regardless of where the mismatch
                occurs, preventing attackers from using timing information to forge tags.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
