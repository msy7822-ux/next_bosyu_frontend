import { Header } from "../components/Header";
import { Layout } from "../components/Layout";
import { Box, Text, Flex } from "@chakra-ui/react";
import { useSession } from "next-auth/client";
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import { useMediaQuery } from 'react-responsive';
import { Offers } from "../components/Offers/Offers";
import { BsTwitter } from 'react-icons/bs';

const MyPage = (props) => {
  const isMobileScreen = useMediaQuery({ query: '(max-width: 560px)' });
  const [session] = useSession();
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
            displayed,
            createdAt
          }
        }
      }
    }
  `
  const { data, isLoading, error } = useQuery(FETCH_USER_INFO);

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
            borderRadius="10"
            p="3"
            pb="1rem"
            border="1px solid #E5E5E5"
          >
            <BsTwitter size="30" color="#57A4FF" display="inline" />
            <Text
              textAlign="center"
              fontSize="25"
              fontWeight="bold"
              color="#737373"
              mx="auto"
              mb="1rem"
              w="70%"
              borderBottom="1px solid #EFEFEF"
            >
              プロフィール
            </Text>
            <Box textAlign="center">
              <Text fontWeight="bold" color="#737373" fontSize="15">{data?.user?.name}</Text>
              <Text fontWeight="bold" color="#737373" fontSize="15">{data?.user?.email}</Text>
            </Box>
          </Box>
          <Box w="100%" textAlign="center">
            <Text
              my="2rem"
              mt="4rem"
              mx="auto"
              textAlign="center"
              w="80%"
              py="1"
              borderRadius="5"
              fontWeight="bold"
              color="#696969"
              border="1px solid #848484"
            >
              掲載中の募集
            </Text>
            {data && data.user &&
              <>
                {
                  data.user.corporate?.jobOfferSlips.map((offer, key) => {
                    return (
                      <Box key={key}>
                        {offer?.displayed &&
                          <Offers offer={offer} recruiterToken={session?.accessToken} user={data?.user} />
                        }
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
