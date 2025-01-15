"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Shield,
  GraduationCap,
  Building2,
  ArrowRight,
  CheckCircle,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { AuroraBackground } from "@/components/ui/aurora-background";
import { GradientButton } from "@/components/gradient-button";

const features = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Secure Verification",
    description:
      "Blockchain-powered certificate verification ensures tamper-proof authenticity",
  },
  {
    icon: <CheckCircle className="w-6 h-6" />,
    title: "Instant Validation",
    description:
      "Real-time certificate validation for employers and organizations",
  },
  {
    icon: <GraduationCap className="w-6 h-6" />,
    title: "Digital Credentials",
    description:
      "Store and manage all your academic credentials in one secure place",
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
    },
  },
};

export default function Home() {
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen gradient-bg">
      {/* Theme Toggle */}
      <motion.div
        className="fixed top-4 right-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="rounded-full"
        >
          {theme === "dark" ? (
            <Sun className="h-5 w-5" />
          ) : (
            <Moon className="h-5 w-5" />
          )}
        </Button>
      </motion.div>
      {/* Hero Section */}
      <AuroraBackground>
        <div className="container mx-auto px-4 pt-24 pb-16">
          <motion.div
            className="text-center max-w-3xl mx-auto"
            initial={{ opacity: 0.0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6 pb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600 ">
              Secure Digital Certificates
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Issue, manage, and verify academic credentials with blockchain
              technology
            </p>
            <motion.div
              className="flex flex-wrap gap-4 justify-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <GradientButton href="/verify">Verify Certificate</GradientButton>
            </motion.div>{" "}
          </motion.div>
        </div>
      </AuroraBackground>
      {/* Features Section */}
      <motion.div
        className="container mx-auto px-4 py-16"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={item}
              className="p-6 rounded-xl bg-card/50 backdrop-blur-lg border border-border/50 hover:border-primary/50 transition-colors"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
      {/* Portal Cards */}
      <motion.div
        className="container mx-auto px-4 py-16"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: <Shield className="w-12 h-12" />,
              title: "Issuer Portal",
              description:
                "For educational institutions to issue and manage certificates",
              href: "/issuer/login",
            },
            {
              icon: <GraduationCap className="w-12 h-12" />,
              title: "Candidate Portal",
              description: "For students to view and share their certificates",
              href: "/candidate/login",
            },
            {
              icon: <Building2 className="w-12 h-12" />,
              title: "Organization Portal",
              description: "For employers to request and verify certificates",
              href: "/organization/login",
            },
          ].map((portal, index) => (
            <Card className="p-6 backdrop-blur-lg bg-card/50 border-border/50 hover:border-primary/50 transition-all duration-300">
              <div className="text-center">
                <motion.div
                  className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {portal.icon}
                </motion.div>
                <h2 className="text-xl font-semibold mb-2">{portal.title}</h2>
                <p className="text-muted-foreground mb-6">
                  {portal.description}
                </p>
                <GradientButton href={portal.href} className="w-full group">
                  Login
                </GradientButton>
              </div>
            </Card>
          ))}
        </div>
      </motion.div>
      <div className="text-center text-md text-muted-foreground py-4">
        Crafted with
        <span className=" animate-pulse">❤️</span>
        by{" "}
        <Link
          href="https://byteprolabs.com"
          target="_blank"
          className="font-medium underline-offset-4 hover:text-primary hover:underline transition-colors"
        >
          ByteProLabs
        </Link>
      </div>
    </div>
  );
}
