import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import dbConnect from "./db";
import User from "./models/user";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  providers: [
    // World ID provider using OAuth
    {
      id: "worldcoin",
      name: "Worldcoin",
      type: "oauth",
      wellKnown: "https://id.worldcoin.org/.well-known/openid-configuration",
      authorization: { params: { scope: "openid" } },
      clientId: process.env.WLD_CLIENT_ID,
      clientSecret: process.env.WLD_CLIENT_SECRET,
      idToken: true,
      checks: ["state", "nonce", "pkce"],
      async profile(profile) {
        // Connect to database
        await dbConnect();

        // Check if user exists
        let user = await User.findOne({
          worldId: profile.sub,
          role: "candidate",
        });

        // If user doesn't exist, create new candidate
        if (!user) {
          const username = `candidate_${Math.random().toString(36).substring(2, 9)}`;
          user = await User.create({
            worldId: profile.sub,
            role: "candidate",
            username,
            name: `Candidate-${profile.sub.slice(0, 8)}`,
            email: `${username}@example.com`,
            verificationLevel: profile["https://id.worldcoin.org/v1"].verification_level,
          });
        }

        return {
          id: user._id.toString(),
          worldId: profile.sub,
          role: user.role,
          name: user.name,
          verificationLevel: profile["https://id.worldcoin.org/v1"].verification_level,
        };
      },
    },

    // Keeping the existing credentials provider for issuers and organizations
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
        role: { label: "Role", type: "text" },
      },
      async authorize(credentials, req) {
        if (!credentials?.username || !credentials?.password || !credentials?.role) {
          return null;
        }

        await dbConnect();

        const user = await User.findOne({
          username: credentials.username,
          role: credentials.role,
        });

        if (!user) {
          throw new Error("Invalid username or password");
        }

        const isValid = await bcrypt.compare(credentials.password, user.password);

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
        token.verificationLevel = user.verificationLevel;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub as string;
        session.user.role = token.role as string;
        session.user.worldId = token.worldId as string;
        session.user.verificationLevel = token.verificationLevel as string;
      }
      return session;
    },
  },
};