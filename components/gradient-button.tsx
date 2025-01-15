import Link from "next/link";
import { Button } from "./ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface GradientButtonProps {
  href: string;
  children: React.ReactNode;
}

export function GradientButton({
  href,
  children,
  className,
}: GradientButtonProps & { className?: string }) {
  return (
    <Link href={href}>
      <Button
        size="lg"
        className={cn(
          "group relative overflow-hidden bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary transition-all duration-300 transform hover:shadow-xl",
          className
        )}
      >
        <span className="relative z-10 flex items-center">
          {children}
          <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-all duration-300 ease-out" />
        </span>
        <div className="absolute inset-0 bg-white/10 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-pink-200 to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300"></div>
      </Button>
    </Link>
  );
}
