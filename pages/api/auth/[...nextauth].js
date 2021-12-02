import axios from "axios";
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
    session(session, token) {
      console.log("callback session is ", session);
      const user = session?.user
      axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, { user: { name: user?.name, email: user?.email, imageUrl: user?.image, token: token.accessToken  } })
      session.accessToken = token.accessToken;
      return session;
    },
  },
})
