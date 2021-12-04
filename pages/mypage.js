import { Header } from "../components/Header";
import { Layout } from "../components/Layout";
import { Box, Text, Link } from "@chakra-ui/react";
import { useSession } from "next-auth/client";
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import { useMediaQuery } from 'react-responsive';
import { Offers } from "../components/Offers/Offers";
import { BsTwitter } from 'react-icons/bs';

const MyPage = () => {
  const isMobileScreen = useMediaQuery({ query: '(max-width: 560px)' });
  const [session] = useSession();
  const twitterBaseUrl = "https://twitter.com";

  console.log('screen name', session?.screenName);

  const FETCH_USER_INFO = gql`
    query {
      user(token: "${session?.accessToken}") {
        id,
        name,
        email,
        imageUrl
        corporate {
          id,
          jobOfferSlips {
            id,
            title,
            content,
            tag,
            createdAt
          }
        }
      }
    }
  `
  const { data, isLoading, error } = useQuery(FETCH_USER_INFO);

  console.log(data);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Something wrong!</p>;
  if (!session) return <p>Loginがありません。</p>;

  return (
    <>
      <Header buttonTitles={["募集をする", "募集を探す", "募集一覧"]}/>
      <Layout>
        {isMobileScreen &&
          <>
          <Box
            mt="1rem"
            bg="#9FCFAF"
            color="#FFF"
            borderRadius="10"
            p="3"
            pb="1rem"
          >
            <Text
              textAlign="center"
              fontSize="25"
              fontWeight="bold"
            >
              <BsTwitter />
              プロフィール
            </Text>
            <Box
              bg="#78A970"
              mt="2"
              borderRadius="5"
            >
              <Text
                textAlign="center"
                py="3"
                fontSize="15"
              >
                {data?.user?.name}
              </Text>
            </Box>
            <Box
              bg="#78A970"
              mt="3"
              borderRadius="5"
            >
              <Text
                textAlign="center"
                py="3"
                fontSize="15"
              >
                {data?.user?.email}
              </Text>
            </Box>
          </Box>
          <Box w="100%" textAlign="center">
            <Text
              my="2rem"
              mx="auto"
              color="#FFF"
              textAlign="center"
              bg="#7B9876"
              w="80%"
              borderRadius="10"
              py="1"
              fontWeight="bold"
            >
              あなたの過去の募集
            </Text>
            {data && data.user &&
              <>
                {
                  data.user.corporate?.jobOfferSlips.map((offer, key) => {
                    return (
                      <Box key={key}>
                        <Offers {...offer} />
                      </Box>
                    );
                  })
                }
              </>
            }
          </Box>
          </>
        }
      </Layout>
    </>
  );
};

export default MyPage;
