"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, FileText, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Certificate {
  certificateId: string;
  issueDate: string;
  metadata: {
    fileName: string;
  };
  isValid: boolean;
}

export default function VerifyPage() {
  const [certificateId, setCertificateId] = useState("");
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const { toast } = useToast();

  const verifyByCertificateId = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/certificates/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ certificateId }),
      });
      
      if (!response.ok) throw new Error('Verification failed');
      
      const data = await response.json();
      setCertificates([data.certificate]);
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Could not verify the certificate",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const searchByUsername = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/certificates/search?username=${username}`);
      
      if (!response.ok) throw new Error('Search failed');
      
      const data = await response.json();
      setCertificates(data.certificates);
    } catch (error) {
      toast({
        title: "Search Failed",
        description: "Could not find certificates for this username",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl backdrop-blur-lg bg-card/50">
        <CardHeader>
          <CardTitle>Verify Certificate</CardTitle>
          <CardDescription>
            Verify certificates using certificate ID or candidate username
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="id" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="id">Certificate ID</TabsTrigger>
              <TabsTrigger value="username">Username</TabsTrigger>
            </TabsList>

            <TabsContent value="id" className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter Certificate ID"
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value)}
                />
                <Button onClick={verifyByCertificateId} disabled={loading}>
                  <Search className="w-4 h-4 mr-2" />
                  Verify
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="username" className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter Candidate Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <Button onClick={searchByUsername} disabled={loading}>
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </TabsContent>

            {certificates.length > 0 && (
              <div className="mt-6 space-y-4">
                {certificates.map((cert) => (
                  <Card key={cert.certificateId}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-2 rounded-full bg-primary/10">
                            <FileText className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">{cert.metadata.fileName}</h3>
                            <p className="text-sm text-muted-foreground">
                              Issued: {new Date(cert.issueDate).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {cert.isValid ? (
                            <div className="flex items-center text-green-500">
                              <CheckCircle className="w-5 h-5 mr-1" />
                              Valid
                            </div>
                          ) : (
                            <div className="flex items-center text-red-500">
                              <XCircle className="w-5 h-5 mr-1" />
                              Invalid
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}