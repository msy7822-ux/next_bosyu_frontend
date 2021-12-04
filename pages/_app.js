import '../styles/globals.css'
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'
import { ChakraProvider } from "@chakra-ui/react";
import { useSession, Provider  } from "next-auth/client";
// import { useSession, SessionProvider  } from "next-auth/react";
import { positions, Provider as AlertProvider } from 'react-alert'
import AlertTemplate from 'react-alert-template-basic';
import axios from 'axios';
import { useEffect } from 'react';

// React Query Client(キャッシュをデフォルトで有効にする)
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      cacheTime: 1000 * 60 * 60 * 24, // 24 hours
    },
  },
});

const defaultOptions = {
  watchQuery: {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'ignore',
  },
  query: {
    fetchPolicy: 'cache-and-network',
    errorPolicy: 'all',
  },
  mutate: {
    errorPolicy: 'all',
  },
}

// function MyApp({ Component, pageProps: { session, ...pageProps } }) {
function MyApp({ Component, pageProps }) {
  // session情報
  const [session, sessionLoading] = useSession();
  console.log('ログイン情報', session);

  // ApolloClient
  const apolloClient = new ApolloClient({
    uri: `${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql?session=${!!session}&token=${session?.accessToken}`,
    cache: new InMemoryCache(),
    defaultOptions: defaultOptions,
  });

  // React Alert Options
  const options = {
    timeout: 5000,
    position: positions.TOP_CENTER,
  }

  if (sessionLoading) return <p>Loading...</p>;

  return (
    <QueryClientProvider client={queryClient}>
      <ApolloProvider client={apolloClient}>
        {/* <SessionProvider session={session}> */}
        <Provider session={session}>
          <ChakraProvider>
            <AlertProvider template={AlertTemplate} {...options}>
              <Component {...pageProps} />
            </AlertProvider>
          </ChakraProvider>
        </Provider>
        {/* </SessionProvider> */}
      </ApolloProvider>
    </QueryClientProvider>
  )
}

export default MyApp
