"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WorldIDButton } from "@/components/auth/world-id-button";
import { Shield } from "lucide-react";

export default function IssuerLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex items-center justify-center p-4">
      <Card className="w-full max-w-md backdrop-blur-lg bg-card/50">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Shield className="w-6 h-6" />
            Issuer Login
          </CardTitle>
          <CardDescription>
            Verify your identity with World ID to manage certificates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WorldIDButton role="issuer" />
        </CardContent>
      </Card>
    </div>
  );
}