"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WorldIDButton } from "@/components/auth/world-id-button";
import { CredentialsLoginForm } from "@/components/auth/credentials-login-form";
import { Shield, GraduationCap, Building2 } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<"issuer" | "organization" | "candidate">("candidate");

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex items-center justify-center p-4">
      <Card className="w-full max-w-md backdrop-blur-lg bg-card/50">
        <CardHeader className="text-center">
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Choose your role to continue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedRole} onValueChange={(value) => setSelectedRole(value as any)}>
            <TabsList className="grid grid-cols-3 w-full">
              <TabsTrigger value="issuer" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Issuer
              </TabsTrigger>
              <TabsTrigger value="candidate" className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Candidate
              </TabsTrigger>
              <TabsTrigger value="organization" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                Organization
              </TabsTrigger>
            </TabsList>

            <TabsContent value="candidate">
              <div className="mt-4">
                <WorldIDButton />
              </div>
            </TabsContent>

            <TabsContent value="issuer">
              <div className="mt-4">
                <CredentialsLoginForm role="issuer" />
              </div>
            </TabsContent>

            <TabsContent value="organization">
              <div className="mt-4">
                <CredentialsLoginForm role="organization" />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}