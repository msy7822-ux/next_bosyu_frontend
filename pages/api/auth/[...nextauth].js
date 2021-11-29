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
      // console.log(url);
      // console.log(baseUrl);
      // 認証後のリダイレクト先を決定する
      return '/';
      // return url; // redirect to '/'
    },
  },
})
