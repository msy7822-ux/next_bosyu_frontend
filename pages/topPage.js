import { Box, Button, Text, Image } from '@chakra-ui/react'
import { useRouter } from 'next/router';

const TopPage = (props) => {
  const router = useRouter();
  return (
    <>
      <Box bg="#9FCFAF" h="100vh">
        <Box width="60%" pt="5rem" m='auto' textAlign="center">
          <Text fontSize="2rem" m="0" color="#FFFFFF">あの求人マッチングサイト”bosyu”が帰ってきた！</Text>
          <Image mt="1rem" src="/nextBosyuLogo.png" alt="next bosyu logo" />
          <Button onClick={() => { router.push('./login') }} border="none" bg='#85BF62' h="70" w="400" px="100" borderRadius="30"color="#FFFFFF" cursor='pointer'>さっそく使ってみる</Button>
        </Box>
      </Box>
    </>
  );
};

export default TopPage;
