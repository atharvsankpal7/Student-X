"use client";

import { Shield } from "lucide-react";
import { CredentialsLoginForm } from "@/components/auth/credentials-login-form";
import { AuthCard } from "@/components/auth/auth-card";

export default function IssuerLoginPage() {
  return (
    <AuthCard
      icon={Shield}
      title="Issuer Login"
      description="Sign in to manage and issue certificates"
    >
      <CredentialsLoginForm role="issuer" />
    </AuthCard>
  );
}