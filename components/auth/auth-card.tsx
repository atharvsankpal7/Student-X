"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { BackgroundGradientAnimation } from "../ui/background-gradient-animation";

interface AuthCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children: React.ReactNode;
}

export function AuthCard({
  icon: Icon,
  title,
  description,
  children,
}: AuthCardProps) {
  return (
    <BackgroundGradientAnimation containerClassName="min-h-screen">
      <div className="absolute z-10 inset-0 flex items-center justify-center p-4 pointer-events-none">
        <Card className="w-full max-w-md backdrop-blur-lg bg-card/70">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-2">
              <Icon className="w-8 h-8" />
            </div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
      </div>
    </BackgroundGradientAnimation>
  );
}
