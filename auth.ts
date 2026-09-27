import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { userRepository } from "@/lib/repositories/userRepository";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET ?? "development-only-change-me",
  providers: [Google({ clientId: process.env.GOOGLE_CLIENT_ID ?? "", clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "" })],
  pages: { signIn: "/signin" },
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account && profile) token.id = String(profile.sub ?? token.sub ?? "");
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.id = String(token.id ?? token.sub ?? "");
      return session;
    },
  },
  events: {
    async signIn({ user, profile }) {
      if (!user.email) return;
      try { await userRepository.upsert({ id: String(profile?.sub ?? user.id ?? ""), name: user.name ?? "", email: user.email, image: user.image ?? "" }); }
      catch (error) { console.error("Unable to sync Google profile to Sheets", error); }
    },
  },
});
