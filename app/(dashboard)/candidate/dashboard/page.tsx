"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Bell, Download, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { StatsOverview } from "@/components/dashboard/stats-overview";

interface Certificate {
  certificateId: string;
  issueDate: string;
  metadata: {
    fileName: string;
  };
}

interface CertificateRequest {
  _id: string;
  organizationId: string;
  status: "pending" | "approved" | "rejected";
  requestDate: string;
}

// Mock data - replace with real API calls
const mockStats = {
  monthly: [
    { month: "Jan", count: 2 },
    { month: "Feb", count: 3 },
    { month: "Mar", count: 1 },
    { month: "Apr", count: 4 },
    { month: "May", count: 2 },
    { month: "Jun", count: 3 },
  ],
  status: [
    { status: "Approved", count: 12 },
    { status: "Pending", count: 3 },
    { status: "Rejected", count: 1 },
  ],
};

export default function CandidateDashboard() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [requests, setRequests] = useState<CertificateRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCertificates();
    fetchRequests();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await fetch("/api/certificates");
      const data = await response.json();
      setCertificates(data);
    } catch (error) {
      console.error("Error fetching certificates:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchRequests = async () => {
    try {
      console.log("Fetching certificate requests...");
      const response = await fetch("/api/certificates/requests");
      const data = await response.json();
      console.log("Response:", data);
      setRequests(data);
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const handleRequestResponse = async (requestId: string, approve: boolean) => {
    try {
      const response = await fetch(`/api/certificates/requests/${requestId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: approve ? "approved" : "rejected" }),
      });

      if (!response.ok) throw new Error("Failed to update request");

      toast({
        title: "Success",
        description: `Request ${
          approve ? "approved" : "rejected"
        } successfully`,
      });

      fetchRequests();
    } catch (error) {
      console.error("Error updating request:", error);
      toast({
        title: "Error",
        description: "Failed to update request",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">My Certificates</h1>

      <StatsOverview certificateStats={mockStats} />

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              My Certificates
            </CardTitle>
            <CardDescription>All certificates issued to you</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-10 bg-muted rounded"></div>
                <div className="h-10 bg-muted rounded"></div>
                <div className="h-10 bg-muted rounded"></div>
              </div>
            ) : certificates.length === 0 ? (
              <p className="text-muted-foreground">No certificates available</p>
            ) : (
              <div className="space-y-4">
                {certificates.map((cert) => (
                  <div
                    key={cert.certificateId}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{cert.metadata.fileName}</p>
                      <p className="text-sm text-muted-foreground">
                        Issued: {new Date(cert.issueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        window.open(
                          `/api/certificates/${cert.certificateId}/file`
                        )
                      }
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5" />
              Certificate Requests
            </CardTitle>
            <CardDescription>
              Pending requests from organizations
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-10 bg-muted rounded"></div>
                <div className="h-10 bg-muted rounded"></div>
                <div className="h-10 bg-muted rounded"></div>
              </div>
            ) : requests.length === 0 ? (
              <p className="text-muted-foreground">No pending requests</p>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <div
                    key={request._id}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">Request from Organization</p>
                      <p className="text-sm text-muted-foreground">
                        Requested:{" "}
                        {new Date(request.requestDate).toLocaleDateString()}
                      </p>
                    </div>
                    {request.status === "pending" && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleRequestResponse(request._id, true)
                          }
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleRequestResponse(request._id, false)
                          }
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Reject
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
