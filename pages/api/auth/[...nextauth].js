import NextAuth from "next-auth";
import TwitterProvider from 'next-auth/providers/twitter';

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    TwitterProvider({
      clientId: process.env.NEXT_PUBLIC_TWITTER_API_KEY,
      clientSecret: process.env.NEXT_PUBLIC_TWITTER_API_SECRET,
    }),
    // ...add more providers here
  ],
  debug: true,

  callbacks: {
    redirect() {
      return '/offers';
    },
    async jwt(token, user, account, profile, isNewUser) {
      if (account?.accessToken) {
        token.accessToken = account.accessToken;
      }
      return token;
    },
    async session(session, token) {
      session.accessToken = token.accessToken;
      return session;
    },
  },
})
