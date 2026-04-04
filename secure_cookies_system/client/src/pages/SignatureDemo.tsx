import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { trpc } from "@/lib/trpc";
import { AlertCircle, CheckCircle, Copy, Key, Shield } from "lucide-react";
import { Link } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";
import { getLoginUrl } from "@/const";

export default function SignatureDemo() {
  const { isAuthenticated, user } = useAuth();
  const [selectedKeyPairId, setSelectedKeyPairId] = useState<number | null>(null);
  const [filename, setFilename] = useState("document.txt");
  const [fileContent, setFileContent] = useState("This is a sample document to be signed.");
  const [signatureResult, setSignatureResult] = useState<any>(null);
  const [verificationResult, setVerificationResult] = useState<any>(null);
  const [selectedFileId, setSelectedFileId] = useState<number | null>(null);
  const [modifiedFileContent, setModifiedFileContent] = useState("");
  const [copiedField, setCopiedField] = useState<string | null>(null);

  // tRPC hooks
  const generateKeyPairMutation = trpc.signatures.generateKeyPair.useMutation();
  const getKeyPairsQuery = trpc.signatures.getKeyPairs.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const signFileMutation = trpc.signatures.signFile.useMutation();
  const getSignedFilesQuery = trpc.signatures.getSignedFiles.useQuery(undefined, {
    enabled: isAuthenticated,
  });
  const getSignedFileQuery = trpc.signatures.getSignedFile.useQuery(
    { fileId: selectedFileId || 0 },
    { enabled: isAuthenticated && selectedFileId !== null }
  );
  const verifySignatureQuery = trpc.signatures.verifyFileSignature.useQuery(
    { fileId: selectedFileId || 0, fileContent: modifiedFileContent || "" },
    { enabled: false }
  );

  // Generate RSA key pair
  const handleGenerateKeyPair = async () => {
    try {
      await generateKeyPairMutation.mutateAsync({ keySize: 2048 });
      await getKeyPairsQuery.refetch();
    } catch (error) {
      console.error("Error generating key pair:", error);
    }
  };

  // Sign file
  const handleSignFile = async () => {
    if (!selectedKeyPairId) {
      alert("Please generate or select a key pair first");
      return;
    }

    try {
      const result = await signFileMutation.mutateAsync({
        filename,
        fileContent,
        keyPairId: selectedKeyPairId,
      });
      setSignatureResult(result);
      await getSignedFilesQuery.refetch();
    } catch (error) {
      console.error("Error signing file:", error);
      alert("Error signing file: " + String(error));
    }
  };

  // Verify signature
  const handleVerifySignature = async () => {
    if (!selectedFileId) {
      alert("Please select a file first");
      return;
    }

    try {
      const result = await verifySignatureQuery.refetch();
      if (result.data) {
        setVerificationResult(result.data);
      }
    } catch (error) {
      console.error("Error verifying signature:", error);
      alert("Error verifying signature: " + String(error));
    }
  };

  // Copy to clipboard
  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-8">
        <div className="container mx-auto px-4">
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <AlertCircle className="w-5 h-5" />
                Authentication Required
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-blue-800">
                You need to log in to access the digital signature demonstration.
              </p>
              <a href={getLoginUrl()}>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Log In to Continue
                </Button>
              </a>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

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
            <Key className="w-8 h-8 text-green-600" />
            <h1 className="text-3xl font-bold text-slate-900">
              RSA Digital Signatures
            </h1>
          </div>
          <p className="text-slate-600">
            Generate key pairs, sign files, and verify authenticity
          </p>
        </div>

        <Tabs defaultValue="keygen" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="keygen">Key Generation</TabsTrigger>
            <TabsTrigger value="sign">Sign File</TabsTrigger>
            <TabsTrigger value="verify">Verify Signature</TabsTrigger>
          </TabsList>

          {/* Key Generation Tab */}
          <TabsContent value="keygen" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Generate RSA Key Pair</CardTitle>
                <CardDescription>
                  Create a 2048-bit RSA key pair for signing and verification
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertCircle className="h-4 w-4 text-blue-700" />
                  <AlertTitle className="text-blue-900">How It Works</AlertTitle>
                  <AlertDescription className="text-blue-800 text-sm">
                    RSA generates a mathematically related key pair: a private key (kept secret)
                    and a public key (shared openly). Data signed with the private key can only be
                    verified with the corresponding public key, proving authenticity.
                  </AlertDescription>
                </Alert>

                <Button
                  onClick={handleGenerateKeyPair}
                  disabled={generateKeyPairMutation.isPending}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {generateKeyPairMutation.isPending ? "Generating..." : "Generate Key Pair"}
                </Button>
              </CardContent>
            </Card>

            {/* Key Pairs List */}
            {getKeyPairsQuery.data && getKeyPairsQuery.data.length > 0 && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-900">
                    <CheckCircle className="w-5 h-5" />
                    Your Key Pairs
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {getKeyPairsQuery.data.map((keyPair) => (
                    <div
                      key={keyPair.id}
                      className="border border-green-300 rounded p-4 bg-white cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedKeyPairId(keyPair.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-semibold text-slate-900">
                          {keyPair.keySize}-bit RSA Key
                        </div>
                        {selectedKeyPairId === keyPair.id && (
                          <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                            Selected
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-600 mb-2">
                        Generated: {new Date(keyPair.generatedAt).toLocaleString()}
                      </p>
                      <div className="bg-slate-100 p-2 rounded text-xs overflow-x-auto">
                        <code className="text-slate-700 break-all">
                          {keyPair.publicKey.substring(0, 100)}...
                        </code>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Sign File Tab */}
          <TabsContent value="sign" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Sign a File</CardTitle>
                <CardDescription>
                  Create a digital signature for a file using your private key
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {!selectedKeyPairId && (
                  <Alert className="bg-yellow-50 border-yellow-200">
                    <AlertCircle className="h-4 w-4 text-yellow-700" />
                    <AlertTitle className="text-yellow-900">Select a Key Pair</AlertTitle>
                    <AlertDescription className="text-yellow-800 text-sm">
                      Please generate or select a key pair in the "Key Generation" tab first.
                    </AlertDescription>
                  </Alert>
                )}

                <div className="space-y-2">
                  <Label htmlFor="filename">Filename</Label>
                  <Input
                    id="filename"
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    placeholder="document.txt"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="content">File Content</Label>
                  <textarea
                    id="content"
                    value={fileContent}
                    onChange={(e) => setFileContent(e.target.value)}
                    className="w-full h-32 p-3 border border-slate-300 rounded"
                    placeholder="Enter file content to be signed"
                  />
                </div>

                <Button
                  onClick={handleSignFile}
                  disabled={!selectedKeyPairId || signFileMutation.isPending}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  {signFileMutation.isPending ? "Signing..." : "Sign File"}
                </Button>
              </CardContent>
            </Card>

            {/* Signature Result */}
            {signatureResult && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-900">
                    <CheckCircle className="w-5 h-5" />
                    File Signed Successfully
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Alert className="bg-green-100 border-green-300">
                    <CheckCircle className="h-4 w-4 text-green-700" />
                    <AlertTitle className="text-green-900">Signature Created</AlertTitle>
                    <AlertDescription className="text-green-800 text-sm">
                      The file has been signed with your private key. The signature can be verified
                      by anyone using your public key, proving the file hasn't been modified.
                    </AlertDescription>
                  </Alert>

                  <div className="bg-white p-4 rounded border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <label className="font-semibold text-slate-900">Digital Signature</label>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(signatureResult.signature, "signature")}
                      >
                        <Copy className="w-4 h-4" />
                        {copiedField === "signature" ? "Copied!" : "Copy"}
                      </Button>
                    </div>
                    <code className="text-xs bg-slate-100 p-3 rounded block overflow-x-auto text-slate-700 break-all">
                      {signatureResult.signature}
                    </code>
                  </div>

                  <div className="bg-white p-4 rounded border border-slate-200">
                    <label className="font-semibold text-slate-900 mb-2 block">
                      File Hash (SHA-256)
                    </label>
                    <code className="text-xs bg-slate-100 p-3 rounded block overflow-x-auto text-slate-700">
                      {signatureResult.fileHash}
                    </code>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Verify Signature Tab */}
          <TabsContent value="verify" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Verify File Signature</CardTitle>
                <CardDescription>
                  Verify that a file hasn't been modified since it was signed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="bg-blue-50 border-blue-200">
                  <AlertCircle className="h-4 w-4 text-blue-700" />
                  <AlertTitle className="text-blue-900">Try This:</AlertTitle>
                  <AlertDescription className="text-blue-800 text-sm">
                    Sign a file first, then modify the content and try to verify it. The verification
                    will fail because the file hash no longer matches the original.
                  </AlertDescription>
                </Alert>

                {getSignedFilesQuery.data && getSignedFilesQuery.data.length > 0 ? (
                  <>
                    <div className="space-y-2">
                      <Label>Select a Signed File</Label>
                      <div className="space-y-2">
                        {getSignedFilesQuery.data.map((file) => (
                          <div
                            key={file.id}
                            className={`border rounded p-3 cursor-pointer transition-colors ${
                              selectedFileId === file.id
                                ? "border-green-500 bg-green-50"
                                : "border-slate-300 hover:border-slate-400"
                            }`}
                            onClick={() => {
                              setSelectedFileId(file.id);
                              setModifiedFileContent("");
                              setVerificationResult(null);
                            }}
                          >
                            <div className="font-semibold text-slate-900">{file.filename}</div>
                            <p className="text-xs text-slate-600">
                              Signed: {new Date(file.signedAt).toLocaleString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedFileId && getSignedFileQuery.data && (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="verify-content">File Content to Verify</Label>
                          <textarea
                            id="verify-content"
                            value={modifiedFileContent || getSignedFileQuery.data.fileContent}
                            onChange={(e) => setModifiedFileContent(e.target.value)}
                            className="w-full h-32 p-3 border border-slate-300 rounded"
                            placeholder="File content"
                          />
                          <p className="text-xs text-slate-500">
                            Tip: Modify the content above and click "Verify Signature" to see
                            verification fail.
                          </p>
                        </div>

                        <Button
                          onClick={handleVerifySignature}
                          disabled={verifySignatureQuery.isFetching}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          {verifySignatureQuery.isFetching ? "Verifying..." : "Verify Signature"}
                        </Button>
                      </>
                    )}
                  </>
                ) : (
                  <Alert className="bg-yellow-50 border-yellow-200">
                    <AlertCircle className="h-4 w-4 text-yellow-700" />
                    <AlertTitle className="text-yellow-900">No Signed Files</AlertTitle>
                    <AlertDescription className="text-yellow-800 text-sm">
                      Sign a file first in the "Sign File" tab to verify it here.
                    </AlertDescription>
                  </Alert>
                )}
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
                        Signature Verified
                      </>
                    ) : (
                      <>
                        <AlertCircle className="w-5 h-5" />
                        Signature Verification Failed
                      </>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {verificationResult.isValid ? (
                    <Alert className="bg-green-100 border-green-300">
                      <CheckCircle className="h-4 w-4 text-green-700" />
                      <AlertTitle className="text-green-900">File Authentic</AlertTitle>
                      <AlertDescription className="text-green-800 text-sm">
                        The signature is valid and the file hash matches. The file hasn't been
                        modified since it was signed.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Alert className="bg-red-100 border-red-300">
                      <AlertCircle className="h-4 w-4 text-red-700" />
                      <AlertTitle className="text-red-900">File Modified</AlertTitle>
                      <AlertDescription className="text-red-800 text-sm">
                        {!verificationResult.hashMatches
                          ? "The file hash does not match. The file content has been modified."
                          : "The signature is invalid. The file may have been tampered with."}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded border border-slate-200">
                      <p className="font-semibold text-slate-900 mb-2 text-sm">
                        Original Hash
                      </p>
                      <code className="text-xs bg-slate-100 p-2 rounded block overflow-x-auto text-slate-700 break-all">
                        {verificationResult.originalHash}
                      </code>
                    </div>
                    <div className="bg-white p-4 rounded border border-slate-200">
                      <p className="font-semibold text-slate-900 mb-2 text-sm">
                        Current Hash
                      </p>
                      <code className="text-xs bg-slate-100 p-2 rounded block overflow-x-auto text-slate-700 break-all">
                        {verificationResult.currentHash}
                      </code>
                    </div>
                  </div>
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
              <h4 className="font-semibold text-slate-900 mb-2">What is RSA?</h4>
              <p>
                RSA is an asymmetric cryptography algorithm that uses a pair of mathematically
                related keys. The private key can encrypt/sign data, and the public key can
                decrypt/verify it. This is the reverse of symmetric encryption.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-2">How Digital Signatures Work</h4>
              <p>
                The signer creates a signature by hashing the file content (SHA-256) and encrypting
                the hash with their private key. The verifier decrypts the signature with the public
                key and compares it to their own hash. If they match, the file is authentic.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Why Use Digital Signatures?</h4>
              <p>
                Digital signatures provide three security properties: authenticity (proves who signed
                it), integrity (proves the file wasn't modified), and non-repudiation (the signer
                can't deny signing it).
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-slate-900 mb-2">Key Size Matters</h4>
              <p>
                This demonstration uses 2048-bit RSA keys, which is considered secure for most
                applications. Larger keys (4096-bit) provide more security but are slower to
                generate and use.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
