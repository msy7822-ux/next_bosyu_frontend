import { Box, Text, Image, Button, Flex } from "@chakra-ui/react"
import { signIn, signOut } from "next-auth/client";
import { useMediaQuery } from 'react-responsive';
import { BsTwitter } from 'react-icons/bs';
import { BsBoxArrowUpRight } from 'react-icons/bs';
import { useRouter } from "next/router";

export default function Home() {
  const isMobileScreen = useMediaQuery({ query: '(max-width: 560px)' });
  const router = useRouter();

  return (
    <>
      <Box bg="#9FCFAF" h="100vh">
        <Box w="60%" pt="6rem" m='auto' textAlign="center">
          <Text m="0" color="#FFFFFF">あの求人マッチングサイト”bosyu”が帰ってきた！</Text>
          <Image mt="30" w="100%" maxW="100%" h="auto" src="/nextBosyuLogo.png" alt="next bosyu logo" />
          <Text color="#FFFFFF" mb="50">Twitterで登録して、今すぐBosyuをしてみましょう！</Text>
          <Box className="btn-container" m="auto">
          {/* TODO:ここのボタン及び、signOut関数は削除予定 */}
          {/* <Button onClick={() => signOut()}>signOut</Button> */}

            {/* デスクトップスクリーン用 */}
            {!isMobileScreen &&
              <>
                <Button
                  onClick={() => signIn()}
                  border="none"
                  bg='#7BBBEA'
                  h="70"
                  w="400"
                  px="100"
                  borderRadius="30"
                  color="#FFFFFF"
                  cursor='pointer'
                  fontWeight="700"
                  fontSize="18"
                  rightIcon={<BsTwitter />}
                >
                  Twitterで登録
                </Button>
                <Text pt="30" color="#726969">※SNSに許可なく投稿することはありません</Text>
              </>
            }

            {/* モバイルスクリーン用 */}
            {isMobileScreen &&
              <>
                <Button
                  onClick={() => signIn()}
                  borderRadius="30"
                  bg='#7BBBEA'
                  border="none"
                  color="#FFFFFF"
                  cursor='pointer'
                  fontWeight="700"
                  px="3rem"
                  py="1.5rem"
                  rightIcon={<BsTwitter />}
                >
                  Twitterで登録
                </Button>
                <Text pt="30" color="#726969">※SNSに許可なく投稿することはありません</Text>
                <Flex onClick={() => router.push('/offers')} mt="3rem" color="#FFF">
                  <Text textAlign="left" px="0" ml="1.5rem" mr="1rem">いますぐ募集を見てみる</Text>
                  <BsBoxArrowUpRight size="20" />
                </Flex>
              </>
            }
          </Box>
        </Box>
      </Box>
    </>
  );  
};
