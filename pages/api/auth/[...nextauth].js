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

    session(session, user) {
      const sessionUser = session?.user

      console.log('session user = ', user?.sub);

      axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, {
        user: {
          name: sessionUser?.name,
          email: sessionUser?.email,
          imageUrl: sessionUser?.image,
          // token: token?.accessToken,
          token: user?.sub,
        }
      });

      // session.accessToken = token?.accessToken;
      session.accessToken = user?.sub;
      return session;
    },
  },
})
