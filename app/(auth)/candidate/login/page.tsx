"use client";

import { GraduationCap } from "lucide-react";
import { WorldIDButton } from "@/components/auth/world-id-button";
import { AuthCard } from "@/components/auth/auth-card";

export default function CandidateLoginPage() {
  return (
    <AuthCard
      icon={GraduationCap}
      title="Candidate Login"
      description="Verify your identity with World ID to access your certificates"
    >
      <WorldIDButton />
    </AuthCard>
  );
}