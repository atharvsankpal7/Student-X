"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, History } from "lucide-react";
import Link from "next/link";
import { StatsOverview } from "@/components/dashboard/stats-overview";

// Mock data - replace with real API calls
const mockStats = {
  monthly: [
    { month: "Jan", count: 12 },
    { month: "Feb", count: 15 },
    { month: "Mar", count: 18 },
    { month: "Apr", count: 14 },
    { month: "May", count: 20 },
    { month: "Jun", count: 25 },
  ],
  status: [
    { status: "Active", count: 85 },
    { status: "Pending", count: 12 },
    { status: "Revoked", count: 3 },
  ],
};

export default function IssuerDashboard() {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch certificates data
    const fetchCertificates = async () => {
      try {
        const response = await fetch('/api/certificates');
        if (response.ok) {
          const data = await response.json();
          setCertificates(data);
        }
      } catch (error) {
        console.error('Error fetching certificates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Certificate Management</h1>
        <Link href="/issuer/dashboard/issue">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Issue Certificate
          </Button>
        </Link>
      </div>

      <StatsOverview certificateStats={mockStats} />

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Recent Certificates
            </CardTitle>
            <CardDescription>Recently issued certificates</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-10 bg-muted rounded"></div>
                <div className="h-10 bg-muted rounded"></div>
                <div className="h-10 bg-muted rounded"></div>
              </div>
            ) : certificates.length > 0 ? (
              <div className="space-y-4">
                {certificates.slice(0, 5).map((cert: any) => (
                  <div key={cert.certificateId} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">{cert.metadata.fileName}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(cert.issueDate).toLocaleDateString()}
                      </p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <FileText className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No certificates issued yet</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Activity Log
            </CardTitle>
            <CardDescription>Recent certificate-related activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loading ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-10 bg-muted rounded"></div>
                  <div className="h-10 bg-muted rounded"></div>
                  <div className="h-10 bg-muted rounded"></div>
                </div>
              ) : (
                <p className="text-muted-foreground">No recent activity</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}