import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "").split(",");

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                // Simple role assignment based on email whitelist
                token.role = ADMIN_EMAILS.includes(user.email || "") ? "admin" : "visitor";
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                (session.user as any).role = token.role;
            }
            return session;
        },
    },
    pages: {
        // We can add custom sign-in pages later if needed
        // signIn: '/auth/signin',
    }
};
