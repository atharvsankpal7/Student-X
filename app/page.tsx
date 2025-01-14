import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Shield, GraduationCap, Building2, ArrowRight, CheckCircle } from 'lucide-react';

const features = [
  {
    icon: <Shield className="w-6 h-6" />,
    title: "Secure Verification",
    description: "Blockchain-powered certificate verification ensures tamper-proof authenticity"
  },
  {
    icon: <CheckCircle className="w-6 h-6" />,
    title: "Instant Validation",
    description: "Real-time certificate validation for employers and organizations"
  },
  {
    icon: <GraduationCap className="w-6 h-6" />,
    title: "Digital Credentials",
    description: "Store and manage all your academic credentials in one secure place"
  }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary to-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/10 bg-[size:20px_20px] [mask-image:radial-gradient(white,transparent_70%)]" />
        <div className="container mx-auto px-4 pt-24 pb-16">
          <div className="text-center max-w-3xl mx-auto animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
              Secure Digital Certificates
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Issue, manage, and verify academic credentials with blockchain technology
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link href="/verify">
                <Button size="lg" className="group">
                  Verify Certificate
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="p-6 rounded-xl bg-card/50 backdrop-blur-lg border border-border/50 hover:border-primary/50 transition-colors transform hover:-translate-y-1 transition-transform duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Portal Cards */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {[
            {
              icon: <Shield className="w-12 h-12" />,
              title: "Issuer Portal",
              description: "For educational institutions to issue and manage certificates",
              href: "/issuer/login"
            },
            {
              icon: <GraduationCap className="w-12 h-12" />,
              title: "Candidate Portal",
              description: "For students to view and share their certificates",
              href: "/candidate/login"
            },
            {
              icon: <Building2 className="w-12 h-12" />,
              title: "Organization Portal",
              description: "For employers to request and verify certificates",
              href: "/organization/login"
            }
          ].map((portal, index) => (
            <div
              key={index}
              className="group transform hover:-translate-y-1 transition-all duration-300 animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <Card className="p-6 backdrop-blur-lg bg-card/50 border-border/50 group-hover:border-primary/50 transition-all duration-300">
                <div className="text-center">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    {portal.icon}
                  </div>
                  <h2 className="text-xl font-semibold mb-2">{portal.title}</h2>
                  <p className="text-muted-foreground mb-6">{portal.description}</p>
                  <Link href={portal.href}>
                    <Button className="w-full group">
                      Login
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}