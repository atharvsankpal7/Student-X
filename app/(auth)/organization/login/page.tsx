"use client";

import { Building2 } from "lucide-react";
import { CredentialsLoginForm } from "@/components/auth/credentials-login-form";
import { AuthCard } from "@/components/auth/auth-card";

export default function OrganizationLoginPage() {
  return (
    <AuthCard
      icon={Building2}
      title="Organization Login"
      description="Sign in to verify and access certificates"
    >
      <CredentialsLoginForm role="organization" />
    </AuthCard>
  );
}