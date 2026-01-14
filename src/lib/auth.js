import GoogleProvider from "next-auth/providers/google";

export const authOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.OAUTH_CLIENT_ID,
            clientSecret: process.env.OAUTH_SECRET,
        }),
    ],
    callbacks: {
        async signIn({ user }) {
            // Only allow danreardon@gmail.com
            if (user.email === "danreardon@gmail.com") {
                return true;
            }
            // Redirect unauthorized users to a custom page
            return `/auth/unauthorized?email=${encodeURIComponent(user.email || 'Unknown')}`;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
};
