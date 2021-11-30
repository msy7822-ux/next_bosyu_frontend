// import gql from 'graphql-tag';
// import { useQuery } from '@apollo/client';
import { useQuery } from 'react-query';
import React from 'react';
import { Layout } from '../components/Layout';
import { Box, Text, Link, Grid, Flex, SimpleGrid } from "@chakra-ui/react"
import { useSession } from 'next-auth/client';
import axios from 'axios';
import { Offers } from '../components/Offers/Offers';
import { Header } from '../components/Header';
import { useMediaQuery } from 'react-responsive';

const apiUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/offers`;

const OffersList = (props) => {
  const [session, loading] = useSession();
  const isMobileScreen = useMediaQuery({ query: '(max-width: 560px)' });
  console.log('ログイン情報', session);

  const fetchOffers = async () => {
    return await axios.get(apiUrl).then((res) => {
      return res.data;
    })
  }

  const { data, isLoading, error } = useQuery('offers', fetchOffers);
  console.log('全ての求人票', data);

  if (loading) return <p>Loading...</p>;
  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>エラーの内容は、{error}</p>;
  return (
    <>
      <Header />
      <Layout>
          <Box mb="1.5rem"></Box>
          {/* デスクトップ用の表示 */}
          <Grid templateColumns="repeat(4, 1fr)" gap={15} w="100%" justifyItems="center" px="0" mx="0" alignContent="center">
            {!isMobileScreen && data && data.offers &&
              data.offers.map((offer, key) => {
                return (
                  <React.Fragment key={key}>

                    <Offers {...offer} />
                    {/* <Link href='/'>
                      <a>
                        <Offers {...offer} />
                      </a>
                    </Link> */}
                  </React.Fragment>
                );
              })
            }
          </Grid>

          {/* モバイル用の表示 */}
          {isMobileScreen && data && data.offers &&
            data.offers.map((offer, key) => {
              return (
                <React.Fragment key={key}>

                  <Offers {...offer} />
                </React.Fragment>
              );
            })
          }
      </Layout>
    </>
  )
};

export default OffersList;
