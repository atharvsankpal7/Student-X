import "next-auth";

declare module "next-auth" {
  interface User {
    worldId: string;
    role: string;
  }

  interface Session {
    user: User & {
      id: string;
      worldId: string;
      role: string;
    };
  }
}