// import gql from 'graphql-tag';
// import { useQuery } from '@apollo/client';
import { useQuery } from 'react-query';
import { Layout } from '../components/Layout';
import { Box, Text, Link } from "@chakra-ui/react"
import { useSession } from 'next-auth/client';
import axios from 'axios';
import { Offers } from '../components/Offers/Offers';
import { Header } from '../components/Header';

const apiUrl = "http://localhost:3000/api/offers";

const OffersList = (props) => {
  const [session, loading] = useSession();
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
          {data && data.offers &&
            data.offers.map((offer, key) => {
              return (
                <Box key={key}>
                  <Offers {...offer} />
                  {/* <Link href='/'>
                    <a>
                      <Offers {...offer} />
                    </a>
                  </Link> */}
                </Box>
              );
            })
          }
      </Layout>
    </>
  )
};

export default OffersList;
