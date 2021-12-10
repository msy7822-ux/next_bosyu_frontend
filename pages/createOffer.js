import { useMediaQuery } from 'react-responsive';
import { Box, Text, Button, Textarea, Input, useToast } from '@chakra-ui/react';
import { Header } from '../components/Header';
import { Layout } from '../components/Layout';
import { useRef, useState } from 'react';
import { gql, useMutation } from '@apollo/client';
import { useSession } from 'next-auth/client';

const CreateOffers = (props) => {
  const isMobileScreen = useMediaQuery({ query: '(max-width: 560px)' });
  const [session] = useSession();
  const toast = useToast();  
  const [tagMsg, setTagMsg] = useState();
  const [title, setTitle] = useState();
  const [content, setContent] = useState();
  const [tag, setTag] = useState(null);
  const inputTitleRef = useRef();
  const inputContentRef = useRef();
  const inputTagRef = useRef();

  const CREATE_OFFER = gql`
    mutation {
      createJobOfferSlip(
        input: {
          title: "${title}"
          content: "${content}"
          tag: "${tag}"
          logined: ${!!session}
          token: "${session.accessToken}"
        }
      ){
        jobOfferSlip {
          id,
          title,
          content,
          tag
        }
      }
    }
  `
  const [createOffer, { data, loading, error }] = useMutation(CREATE_OFFER);

  const handleChangeTitle = (event) => {
    let value = event.target.value
    if (!!event.target.value.match(/\n/)) {
      console.log(event.target.value.replace(/\n/g, "/s"));
      value = value.replace(/\n/g, "/s")
    }
    setTitle(value);
  }

  const handleChangeContent = (event) => {
    let value = event.target.value
    if (!!event.target.value.match(/\n/)) {
      console.log(event.target.value.replace(/\n/g, "/s"));
      value = value.replace(/\n/g, "/s")
    }
    setContent(value);
  }

  const handleChangeTags = (event) => {
    const value = event.target.value
    let tag = value.replace(/\s+/g, '');
    tag = tag.replace(/＃/g, '#');

    if (value !== '' && value !== undefined && tag.slice(0, 1) !== '#') {
      setTagMsg('タグにシャープ（#）を使用してください。');
    }

    if (value !== '' && value !== undefined && tag.indexOf('#') === -1) {
      setTagMsg('タグに（#）を使用してください。');
    }

    if (value !== '' && value !== undefined &&  tag.slice(0, 1) === '#' && tag.indexOf('#') !== -1) {
      setTagMsg(null);
    }

    setTag(tag);
  }

  const handleSubmit = (event) => {
    if (!session) {
      toast({
        title: '募集を行うには、ログインを行ってください。',
        status: 'error',
        position: 'top',
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    const invalidCondition = title === '' || content === '' || title === undefined || content === undefined;
    if (invalidCondition) {
      toast({
        title: '必要なデータが不足しています。',
        description: '「※」のついている箇所は必ず埋めてください。',
        status: 'error',
        position: 'top',
        duration: 9000,
        isClosable: true,
      });
      return;
    }

    if (tagMsg) {
      toast({
        title: 'タグが不正です。',
        description: '注意書きに従って修正してください。',
        status: 'error',
        position: 'top',
        duration: 9000,
        isClosable: true,
      });

      return;
    }

    createOffer().then((res) => {
      console.log('mutation result ', res.data?.createJobOfferSlip);
      toast({
        title: '募集の作成が完了しました。',
        status: 'success',
        position: 'top',
        duration: 9000,
        isClosable: true,
      });

      inputTitleRef.current.value = '';
      inputContentRef.current.value = '';
      inputTagRef.current.value = '';  
    }).catch((err) => {
      console.log('エラーの内容: ', err);
      toast({
        title: 'エラーが発生しました。',
        status: 'error',
        position: 'top',
        duration: 9000,
        isClosable: true,
      });
    });
  }

  if (!session) return <p>Loginがありません。</p>;

  return (
    <>
      {isMobileScreen &&
      <>
        <Header buttonTitles={["募集一覧", "募集を探す"]} />
        <Layout>
          <Box
            mt="1.5rem"
            textAlign="center"
            p="1.5rem"
            borderWidth="1px"
            borderRadius="4"
          >
            <Text
              border="none"
              fontWeight="bold"
              color="#9B9B9B"
              pb="2"
            >
              ※募集タイトル
            </Text>
            <Textarea
              ref={inputTitleRef}
              onChange={handleChangeTitle}
              bg="#FFF"
              placeholder="例: TypeScriptを使いこなせるエンジニアを募集!!"
            />
            <Text
              mt="1rem"
              color="#9B9B9B"
              pb="2"
              fontWeight="bold"
            >
              ※募集内容
            </Text>
            <Textarea
              borderRadius="4"
              ref={inputContentRef}
              onChange={handleChangeContent}
              // border="none"
              h="150"
              size="sm"
              bg="#FFF"
              placeholder="例: 弊社では、アーキテクチャをSPAにし、さらにTypeScriptの導入もしましたが、社内にTypeScriptに強いエンジニアがいません。そんな弊社のTypeScriptプロジェクトを引っ張ってくれる強いエンジニアを募集します!!"
            />
            <Text
              mt="1rem"
              border="none"
              color="#9B9B9B"
              pb="2"
              fontWeight="bold"
            >
              タグの追加<br />（※例のように入力してください。）
            </Text>
            <Text color="#FF4A4A">{tagMsg ? tagMsg : ''}</Text>
            <Input ref={inputTagRef} onChange={handleChangeTags} mr="2" bg="#FFF" color="#2D8DFF" placeholder="例: #タグ1 #タグ２" />
            <Button
              onClick={handleSubmit}
              px="2.5rem"
              py="1rem"
              bg="#53AF5C"
              mt="2rem"
              borderRadius="20"
              color="#FFF"
            >
              募集をする
            </Button>
          </Box>
        </Layout>
      </>
      }
    </>
  );
};

export default CreateOffers;
