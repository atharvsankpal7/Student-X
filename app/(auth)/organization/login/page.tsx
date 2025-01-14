"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WorldIDButton } from "@/components/auth/world-id-button";
import { Building2 } from "lucide-react";

export default function OrganizationLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex items-center justify-center p-4">
      <Card className="w-full max-w-md backdrop-blur-lg bg-card/50">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Building2 className="w-6 h-6" />
            Organization Login
          </CardTitle>
          <CardDescription>
            Verify your identity with World ID to verify certificates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WorldIDButton role="organization" />
        </CardContent>
      </Card>
    </div>
  );
}