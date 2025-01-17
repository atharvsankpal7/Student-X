import "next-auth";

declare module "next-auth" {
  interface User {
    worldId: string;
    role: string;
    verificationLevel?: string;
  }

  interface Session {
    user: User & {
      id: string;
      worldId: string;
      role: string;
      verificationLevel?: string;
    };
  }

  // Add JWT type to include custom fields
  interface JWT {
    worldId?: string;
    role?: string;
    verificationLevel?: string;
  }
}