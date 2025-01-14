"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FileText, Clock, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { StatsOverview } from "@/components/dashboard/stats-overview";

interface Certificate {
  certificateId: string;
  issueDate: string;
  metadata: {
    fileName: string;
  };
  hasAccess: boolean;
}

// Mock data - replace with real API calls
const mockStats = {
  monthly: [
    { month: "Jan", count: 5 },
    { month: "Feb", count: 8 },
    { month: "Mar", count: 12 },
    { month: "Apr", count: 7 },
    { month: "May", count: 15 },
    { month: "Jun", count: 10 },
  ],
  status: [
    { status: "Verified", count: 45 },
    { status: "Pending", count: 8 },
    { status: "Expired", count: 2 },
  ],
};

export default function OrganizationDashboard() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const { toast } = useToast();

  const searchCertificates = async () => {
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

  const requestAccess = async (certificateId: string) => {
    try {
      const response = await fetch('/api/certificates/requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ certificateId, candidateId: username }),
      });

      if (!response.ok) throw new Error('Request failed');

      toast({
        title: "Request Sent",
        description: "Access request has been sent to the candidate",
      });
    } catch (error) {
      toast({
        title: "Request Failed",
        description: "Could not send access request",
        variant: "destructive",
      });
    }
  };

  const viewCertificate = (certificateId: string) => {
    window.open(`/api/certificates/${certificateId}/file`, '_blank');
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Certificate Verification</h1>

      <StatsOverview certificateStats={mockStats} />

      <Card>
        <CardHeader>
          <CardTitle>Search Certificates</CardTitle>
          <CardDescription>
            Search for candidate certificates by username
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Input
              placeholder="Enter candidate username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Button onClick={searchCertificates} disabled={loading}>
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {certificates.length > 0 && (
        <div className="grid gap-4">
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
                  <div>
                    {cert.hasAccess ? (
                      <Button
                        variant="outline"
                        onClick={() => viewCertificate(cert.certificateId)}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        View Certificate
                      </Button>
                    ) : (
                      <Button
                        variant="outline"
                        onClick={() => requestAccess(cert.certificateId)}
                      >
                        <Clock className="w-4 h-4 mr-2" />
                        Request Access
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}