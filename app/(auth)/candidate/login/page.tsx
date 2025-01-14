"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WorldIDButton } from "@/components/auth/world-id-button";
import { GraduationCap } from "lucide-react";

export default function CandidateLoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex items-center justify-center p-4">
      <Card className="w-full max-w-md backdrop-blur-lg bg-card/50">
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <GraduationCap className="w-6 h-6" />
            Candidate Login
          </CardTitle>
          <CardDescription>
            Verify your identity with World ID to access your certificates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <WorldIDButton role="candidate" />
        </CardContent>
      </Card>
    </div>
  );
}