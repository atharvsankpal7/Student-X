"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Shield, GraduationCap, Building2, LogOut } from "lucide-react";
import { signOut } from "next-auth/react";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  // Protect routes - redirect to home if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const roleIcon = {
    issuer: <Shield className="w-5 h-5" />,
    candidate: <GraduationCap className="w-5 h-5" />,
    organization: <Building2 className="w-5 h-5" />,
  }[session?.user?.role || "issuer"];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary">
      <nav className="border-b bg-card/50 backdrop-blur-lg sticky top-0 z-10">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {roleIcon}
            <span className="font-semibold capitalize">
              {session?.user?.role} Dashboard
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => signOut({ callbackUrl: "/" })}
            aria-label="Sign out"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}