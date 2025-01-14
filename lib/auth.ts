import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "./db";
import User from "./models/user";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "worldcoin",
      name: "World ID",
      credentials: {
        worldId: { label: "World ID", type: "text" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.worldId || !credentials?.role) {
          return null;
        }

        await dbConnect();

        let user = await User.findOne({ worldId: credentials.worldId });

        if (!user) {
          // Generate a unique username
          const username = `user_${Math.random().toString(36).substring(2, 9)}`;
          
          user = await User.create({
            worldId: credentials.worldId,
            role: credentials.role,
            username,
            name: `User-${credentials.worldId.slice(0, 8)}`,
            email: `${username}@example.com`,
          });
        }

        return {
          id: user._id.toString(),
          worldId: user.worldId,
          role: user.role,
          name: user.name,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.worldId = user.worldId;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
        session.user.worldId = token.worldId as string;
      }
      return session;
    },
  },
};