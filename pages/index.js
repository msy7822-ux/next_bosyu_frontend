import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import { Layout } from '../components/Layout';
import { Text } from '@chakra-ui/layout';

export default function Home() {
  // MEMO: ここのファイルをもう少し整理したい
  // TODO: Figmaみたいなツールを使ってデザインカンプを作成したい
  const fetchUsers = gql`
    query {
      users {
        id,
        email,
        loginWay,
        lastName,
        firstName,
      }
    }
`;

  // const { loading, error, data: users } = useQuery(fetchUsers);

  // console.log('users are', users);

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>エラーが発生しました。エラーの詳細：{error?.message}</p>;

  return (
    <>
      <Layout>
        <Text m='0'>ksdjvefojvfivjefiv</Text>
      </Layout>
    </>
  )
}
