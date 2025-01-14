import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WorldIDButton } from "@/components/auth/world-id-button";
import { Shield, GraduationCap, Building2 } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary flex items-center justify-center p-4">
      <Card className="w-full max-w-md backdrop-blur-lg bg-card/50">
        <CardHeader className="text-center">
          <CardTitle>Login</CardTitle>
          <CardDescription>
            Choose your role and verify with World ID
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5" />
              <h3 className="font-medium">Issuer</h3>
            </div>
            <WorldIDButton role="issuer" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <GraduationCap className="w-5 h-5" />
              <h3 className="font-medium">Candidate</h3>
            </div>
            <WorldIDButton role="candidate" />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-5 h-5" />
              <h3 className="font-medium">Organization</h3>
            </div>
            <WorldIDButton role="organization" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}