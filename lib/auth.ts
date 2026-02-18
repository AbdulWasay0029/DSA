import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import connectDB from "@/lib/db";
import { UserProgress } from "@/lib/models";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || "").split(",");

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
    ],
    callbacks: {
        async signIn({ user }) {
            try {
                await connectDB();
                await UserProgress.findOneAndUpdate(
                    { email: user.email },
                    {
                        email: user.email,
                        lastActive: new Date(),
                        // Ensure newly created users have empty arrays if they didn't exist
                        $setOnInsert: { completedNotes: [] }
                    },
                    { upsert: true, new: true }
                );
                return true;
            } catch (error) {
                console.error("Error tracking user login:", error);
                return true; // Allow login even if tracking fails
            }
        },
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
        signIn: '/login',
        error: '/login', // Redirect errors back to login page
    },
    debug: process.env.NODE_ENV === 'development',
};
