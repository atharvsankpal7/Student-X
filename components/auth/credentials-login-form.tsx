"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface CredentialsLoginFormProps {
  role: "issuer" | "organization";
}

interface FormData {
  username: string;
  password: string;
}

export function CredentialsLoginForm({ role }: CredentialsLoginFormProps) {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();
  const router = useRouter();
  const { toast } = useToast();

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      const result = await signIn("credentials", {
        username: data.username,
        password: data.password,
        role: role,
        redirect: false,
      });

      if (result?.error) {
        toast({
          title: "Authentication failed",
          description: "Please check your credentials and try again",
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Authentication successful",
        description: "Redirecting to dashboard...",
      });

      router.push(`/${role}/dashboard`);
      router.refresh();
    } catch (error) {
      toast({
        title: "Authentication error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Input
          type="text"
          placeholder="Username"
          {...register("username", { required: "Username is required" })}
          disabled={loading}
        />
        {errors.username && (
          <p className="text-sm text-destructive">{errors.username.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Input
          type="password"
          placeholder="Password"
          {...register("password", { required: "Password is required" })}
          disabled={loading}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading && <LoadingSpinner className="mr-2" />}
        Sign In
      </Button>
    </form>
  );
}