import '../styles/globals.css'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import { ChakraProvider } from "@chakra-ui/react";
import { useSession, Provider  } from "next-auth/client";
import axios from 'axios';
import { useEffect } from 'react';
import { positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic';

// React Query Client(キャッシュをデフォルトで有効にする)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

// ApolloClient
const apolloClient = new ApolloClient({
  uri: `${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`,
  cache: new InMemoryCache()
});

function MyApp({ Component, pageProps }) {
  // session情報
  const [session, sessionLoading] = useSession();
  console.log('session user is', session);

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
    <QueryClientProvider client={queryClient}>
      <ApolloProvider client={apolloClient}>
        <Provider session={session}>
          <ChakraProvider>
            <AlertProvider template={AlertTemplate} {...options}>
              <Component {...pageProps} />
            </AlertProvider>
          </ChakraProvider>
        </Provider>
      </ApolloProvider>
    </QueryClientProvider>
  )
}

export default MyApp
