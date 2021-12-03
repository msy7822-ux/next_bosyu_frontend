import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import React, { useState, useRef } from 'react';
import { Layout } from '../components/Layout';
import { Box, Button, Text, Link, Grid, Flex, SimpleGrid } from "@chakra-ui/react"
import { Offers } from '../components/Offers/Offers';
import { Header } from '../components/Header';
import { useMediaQuery } from 'react-responsive';
import { AiFillPlusCircle } from 'react-icons/ai';
// import { useSession } from 'next-auth/client';

const OffersList = (props) => {
  // const [session] = useSession();
  const isMobileScreen = useMediaQuery({ query: '(max-width: 560px)' });
  const [string, setString] = useState(null);
  const [offers, setOffers] = useState([]);
  const moreButton = useRef();

  const fetchJobOffers = gql`
    query {
      jobOfferSlips(first: 16, after: "${string}") {
        pageInfo {
          hasNextPage,
          endCursor,
          startCursor,
          hasPreviousPage
        },
        edges {
          node {
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
      }
    }
  `;

  const fatchMoreOffer = () => {
    setString(data?.jobOfferSlips?.pageInfo?.endCursor);
    refetch();
  }

  const { data, isLoading, error, refetch } = useQuery(fetchJobOffers, {
    onCompleted: (res) => {
      if (res?.jobOfferSlips?.edges) {
        const offerIds = offers.map((offer) => { return offer.node.id });
        if(offerIds.includes(res?.jobOfferSlips?.edges[0].node.id)) { // 誤って同じフェッチデータが保存されるを未然に防ぐ
          return;
        }
        setOffers([...offers, res?.jobOfferSlips?.edges].flat())
      }
    }
  });
  
  // if (session === null) return <p>ログインしてください。</p>;
  if (!error && isLoading) return <p>Loading...</p>;

  return (
    <>
      <Header isError={!!error} buttonTitle="募集をする" />
      <Layout>
          <Box mb="1.5rem"></Box>
          {/* デスクトップ用の表示 */}
          <Grid templateColumns="repeat(4, 1fr)" gap={15} w="100%" justifyItems="center" px="0" mx="0" alignContent="center">
            {!isMobileScreen && data && data.jobOfferSlips &&
              data.jobOfferSlips?.edges.map((offers, key) => {
                return (
                  <React.Fragment key={key}>
                    <Offers {...offers?.node} />
                  </React.Fragment>
                );
              })
            }
          </Grid>

          {isMobileScreen && offers !== [] &&        
            offers.map((offer, key) => {
              return (
                <React.Fragment key={key}>
                  <Offers {...offer?.node} />
                </React.Fragment>
              );
            })
          }
          
          <Box w="100%" textAlign="center" my="1rem">
            <Button
              ref={moreButton}
              disabled={!data?.jobOfferSlips?.pageInfo?.hasNextPage}
              onClick={() => {
                fatchMoreOffer();
                moreButton.current.style.background = "#53AF5C"
              }}
              bg="#53AF5C"
              color="#FFF"
            >
              もっとみる &nbsp; <AiFillPlusCircle size="20" />
            </Button>
          </Box>
      </Layout>
    </>
  )
};

export default OffersList;
