"use client";

import { IDKitWidget } from "@worldcoin/idkit";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface WorldIDButtonProps {
  role: "issuer" | "candidate" | "organization";
}

export function WorldIDButton({ role }: WorldIDButtonProps) {
  const router = useRouter();
  const { toast } = useToast();

  const handleVerify = async (proof: any) => {
    try {
      const result = await signIn("worldcoin", {
        worldId: proof.nullifier_hash,
        role: role,
        redirect: false,
      });

      if (result?.error) {
        toast({
          title: "Authentication failed",
          description: "Please try again",
          variant: "destructive",
        });
        return;
      }

      // Show success toast
      toast({
        title: "Authentication successful",
        description: "Redirecting to dashboard...",
      });

      // Redirect to the appropriate dashboard
      router.push(`/${role}/dashboard`);
      router.refresh();
    } catch (error) {
      console.error("Authentication error:", error);
      toast({
        title: "Authentication error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    }
  };

  return (
    <IDKitWidget
      app_id={`app_${process.env.NEXT_PUBLIC_WORLDCOIN_APP_ID!}`}
      action="login"
      onSuccess={handleVerify}
      handleVerify={handleVerify}
      // credential_types={["orb", "phone"]}
      
    >
      {({ open }) => (
        <Button
          className="w-full"
          onClick={open}
        >
          Verify with World ID
        </Button>
      )}
    </IDKitWidget>
  );
}