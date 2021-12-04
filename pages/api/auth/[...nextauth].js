import axios from "axios";
import NextAuth from "next-auth";
import TwitterProvider from 'next-auth/providers/twitter';

export default NextAuth({
  providers: [
    TwitterProvider({
      clientId: process.env.NEXT_PUBLIC_TWITTER_API_KEY,
      clientSecret: process.env.NEXT_PUBLIC_TWITTER_API_SECRET,
    }),
  ],
  debug: true,

  callbacks: {
    redirect() {
      return '/offers';
    },
    jwt(token, user, account, profile, isNewUser) {
      if (account?.accessToken) {
        token.accessToken = account.accessToken;
        token.user_profile = profile;
      }
      return token;
    },
    session(session, token) {
      const user = session?.user
      axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, {
        user: {
          name: user?.name,
          email: user?.email,
          imageUrl: user?.image,
          token: token.accessToken,
          display_name: token?.user?.screen_name
        }
      })
      session.screenName = token?.user?.screen_name;
      session.accessToken = token.accessToken;
      return session;
    },
  },
})
