"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Upload, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function IssueCertificatePage() {
  const [file, setFile] = useState<File | null>(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !username) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("username", username);

      const response = await fetch("/api/certificates", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to issue certificate");
      }

      const successData = await response.json();
      toast({
        title: "Success",
        description: `Certificate issued successfully to ${successData.candidateName || username}`,
      });

      router.push("/issuer/dashboard");
    } catch (error) {
      console.error("Issue certificate error:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to issue certificate",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Issue New Certificate</CardTitle>
          <CardDescription>
            Upload a certificate PDF and enter the candidate username
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Candidate Username</label>
              <Input
                type="text"
                placeholder="Enter candidate username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Certificate PDF</label>
              <div className="border-2 border-dashed rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="certificate-file"
                  required
                />
                <label
                  htmlFor="certificate-file"
                  className="cursor-pointer flex flex-col items-center"
                >
                  <Upload className="w-8 h-8 mb-2 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">
                    {file ? file.name : "Click to upload PDF"}
                  </span>
                </label>
              </div>
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Issue Certificate
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}