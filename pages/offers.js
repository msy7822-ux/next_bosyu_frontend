import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import React, { useState, useEffect } from 'react';
import { Layout } from '../components/Layout';
import { Box, Button } from "@chakra-ui/react"
import { Offers } from '../components/Offers/Offers';
import { Header } from '../components/Header';
import { useMediaQuery } from 'react-responsive';
import { AiFillPlusCircle } from 'react-icons/ai';
import { useInView } from 'react-intersection-observer';

const OffersList = (props) => {
  const isMobileScreen = useMediaQuery({ query: '(max-width: 560px)' });
  const [cursor, setCursor] = useState(null);
  const [offers, setOffers] = useState([]);
  const [hasNextPage, setHasNextPage] = useState(false)
  const {ref, inView} = useInView();

  const fetchJobOffers = gql`
    query {
      jobOfferSlips(first: 5, after: "${cursor === undefined ? null : cursor}") {
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
            createdAt,
            tag,
            corporate {
              id,
              user {
                id,
                name,
                token
              }
            }    
          }
        }
      }
    }
  `;

  const fetchMoreOffer = () => {
    setCursor(data?.jobOfferSlips?.pageInfo?.endCursor);
    refetch();
  };

  useEffect(() => {
    if (inView) {
      fetchMoreOffer();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView]);

  const { data, isLoading, error, refetch } = useQuery(fetchJobOffers, {
    onCompleted: (res) => {
      if (res?.jobOfferSlips?.edges) {
        const offerIds = offers.map((offer) => { return offer?.node?.id });
        if(offerIds.includes(res?.jobOfferSlips?.edges[0]?.node?.id)) { // 誤って同じフェッチデータが保存されるを未然に防ぐ
          return;
        }
        setOffers([...offers, res?.jobOfferSlips?.edges].flat());
        setHasNextPage(res?.jobOfferSlips?.pageInfo?.hasNextPage);
      }
    }
  });

  if (!error && isLoading) return <p>Loading...</p>;

  return (
    <>
      <Header buttonTitles={["募集をする", "募集を探す"]} />
      <Layout>
          {/* モバイル用の表示 */}
          {isMobileScreen && offers !== [] &&
            <>     
              {
                offers.map((offer, key) => {
                  return (
                    <React.Fragment key={key}>
                      <Offers offer={offer?.node} recruiterToken={offer?.node?.corporate.user.token} />
                    </React.Fragment>
                  );
                })
              }

              <Box w="100%" textAlign="center" mb="5rem">
                <Button
                  ref={ref}
                  border="1px solid #818181"
                  bg="#FFF"
                  color="#818181"
                  disabled={!hasNextPage}
                  onClick={() => {
                    fetchMoreOffer();
                  }}
                >
                  もっとみる &nbsp; <AiFillPlusCircle size="20" />
                </Button>
              </Box>
            </>
          }
      </Layout>
    </>
  )
};

export default OffersList;
