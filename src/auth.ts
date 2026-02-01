import NextAuth from "next-auth"
import Google from "next-auth/providers/google"

// List of allowed emails (Whitelist)
const ALLOWED_EMAILS = [
    "nuttiwutsimsiri@gmail.com", // Add your emails here
    "sophidapromsai.01@gmail.com"
];

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
    ],
    callbacks: {
        async signIn({ user }) {
            if (user.email && ALLOWED_EMAILS.includes(user.email)) {
                return true;
            }
            return false; // Deny access for other emails
        },
    },
    pages: {
        signIn: "/auth/signin",
        error: "/auth/error",
    },
})
