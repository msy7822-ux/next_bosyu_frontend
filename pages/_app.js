import '../styles/globals.css'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import { useSession } from "next-auth/client";
import axios from 'axios';
import { useEffect } from 'react';

import { transitions, positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic';

// ApolloClient
const client = new ApolloClient({
  uri: `${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`,
  cache: new InMemoryCache()
});

function MyApp({ Component, pageProps }) {
  // session情報
  const [session, sessionLoading] = useSession();
  console.log('session user is ', session?.user);

  // React Alert Options
  const options = {
    timeout: 5000,
    position: positions.TOP_CENTER,
  }

  // 下記のようなログイン情報の送信方法ではなく、各リクエストにログインしているかどうかみたいなログイン情報を加えてあげることでセッションの確認するでもいいかも
  useEffect(() => {
    axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/login`, { user: session?.user })
  }, [session, sessionLoading]);

  if (sessionLoading) return <p>Loading...</p>;

  return (
    <ApolloProvider client={client}>
      <AlertProvider template={AlertTemplate} {...options}>
        <Component {...pageProps} />
      </AlertProvider>
    </ApolloProvider>
  )
}

export default MyApp