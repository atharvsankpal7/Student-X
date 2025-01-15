import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "./db";
import User from "./models/user";
import bcrypt from "bcryptjs";
import { Console } from "console";

export const authOptions: NextAuthOptions = {
  providers: [
    // World ID provider for candidates
    CredentialsProvider({
      id: "worldcoin",
      name: "World ID",
      credentials: {
        worldId: { label: "World ID", type: "text" },
      },
      async authorize(credentials) {
        if (!credentials?.worldId) {
          return null;
        }

        await dbConnect();

        let user = await User.findOne({
          worldId: credentials.worldId,
          role: "candidate",
        });

        if (!user) {
          // Generate a unique username for new candidate
          const username = `candidate_${Math.random()
            .toString(36)
            .substring(2, 9)}`;

          user = await User.create({
            worldId: credentials.worldId,
            role: "candidate",
            username,
            name: `Candidate-${credentials.worldId.slice(0, 8)}`,
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

    // Username/password provider for issuers and organizations
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials, req) {
        if (
          !credentials?.username ||
          !credentials?.password ||
          !credentials?.role
          ) {
            return null;
          }
          
          await dbConnect();
          // You can use this in a setup script
          
          console.log(credentials);
          
     
        const user = await User.findOne({
          username: credentials.username,
          role: credentials.role,
        });
          

        if (!user) {
          throw new Error("Invalid username or password");
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValid) {
          throw new Error("Invalid username or password");
        }

        return {
          id: user._id.toString(),
          role: user.role,
          name: user.name,
          worldId: user.worldId,
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
