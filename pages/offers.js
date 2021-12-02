import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import React, { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { Box, Text, Link, Grid, Flex, SimpleGrid } from "@chakra-ui/react"
import { useSession } from 'next-auth/client';
import { Offers } from '../components/Offers/Offers';
import { Header } from '../components/Header';
import { useMediaQuery } from 'react-responsive';
import { useToast } from '@chakra-ui/toast';
import { useRouter } from 'next/router';

const OffersList = (props) => {
  const toast = useToast();
  const router = useRouter();
  const session = useSession();
  const isMobileScreen = useMediaQuery({ query: '(max-width: 560px)' });
  console.log('ログイン情報', session);

  // offerの内容で必要なデータ => [id、 掲載者名、　掲載者画像、募集内容、募集タイトル、募集のタグ（あれば）]
  const fetchJobOffers = gql`
    query {
      jobOfferSlips {
        id,
        title,
        content,
        corporate {
          id,
          user {
            id,
            name
          }
        }
      }
    }
  `;

  const { data, isLoading, error } = useQuery(fetchJobOffers, {
    errorPolicy: 'all',
    onError: (error) => {
      toast({
        title: 'エラーが発生しました。',
        description: 'ログインが確認できないことが考えられます。',
        status: 'error',
        position: 'top',
        duration: 9000,
        isClosable: true,
      })

      router.push('/');
    }}
  );

  console.log('全ての求人票', data?.jobOfferSlips);
  if (!error && isLoading) return <p>Loading...</p>;
  return (
    <>
      <Header isError={!!error} />
      <Layout>
          <Box mb="1.5rem"></Box>
          {/* デスクトップ用の表示 */}
          <Grid templateColumns="repeat(4, 1fr)" gap={15} w="100%" justifyItems="center" px="0" mx="0" alignContent="center">
            {!isMobileScreen && data && data.jobOfferSlips &&
              data.jobOfferSlips.map((offer, key) => {
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
          {isMobileScreen && data && data.jobOfferSlips &&
            data.jobOfferSlips.map((offer, key) => {
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
