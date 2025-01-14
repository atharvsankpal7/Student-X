"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle, XCircle, Building2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CertificateRequest {
  _id: string;
  organizationId: string;
  certificateId: {
    metadata: {
      fileName: string;
    };
  };
  status: "pending" | "approved" | "rejected";
  requestDate: string;
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<CertificateRequest[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/certificates/requests');
      if (!response.ok) throw new Error('Failed to fetch requests');
      const data = await response.json();
      setRequests(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load access requests",
        variant: "destructive",
      });
    }
  };

  const handleRequest = async (requestId: string, status: string, accessDuration?: number) => {
    try {
      const response = await fetch(`/api/certificates/requests/${requestId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, accessDuration }),
      });

      if (!response.ok) throw new Error('Failed to update request');

      toast({
        title: "Success",
        description: `Request ${status === 'approved' ? 'approved' : 'rejected'} successfully`,
      });

      fetchRequests();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update request",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Access Requests</h1>

      <div className="grid gap-4">
        {requests.map((request) => (
          <Card key={request._id}>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-full bg-primary/10">
                    <Building2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">
                      {request.certificateId.metadata.fileName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Requested: {new Date(request.requestDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {request.status === 'pending' ? (
                  <div className="flex items-center gap-2">
                    <Select
                      onValueChange={(value) => 
                        handleRequest(request._id, 'approved', parseInt(value))
                      }
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 days access</SelectItem>
                        <SelectItem value="30">30 days access</SelectItem>
                        <SelectItem value="90">90 days access</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      onClick={() => handleRequest(request._id, 'rejected')}
                    >
                      <XCircle className="w-4 h-4 mr-2" />
                      Reject
                    </Button>
                  </div>
                ) : (
                  <span className={`px-2 py-1 text-sm rounded ${
                    request.status === 'approved' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}

        {requests.length === 0 && (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No access requests to display
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}