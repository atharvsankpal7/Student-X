"use client";

import { IDKitWidget } from "@worldcoin/idkit";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";



export function WorldIDButton() {
  const router = useRouter();
  const { toast } = useToast();

  const handleVerify = async (proof: any) => {
    try {
      const result = await signIn("worldcoin", {
        worldId: proof.nullifier_hash,
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

      toast({
        title: "Authentication successful",
        description: "Redirecting to dashboard...",
      });

      router.push(`/user/dashboard`);
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