import { Box } from "@chakra-ui/layout";
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { AiFillHome } from 'react-icons/ai';
import { BsPersonCircle } from 'react-icons/bs';
import { MdOutlineCreate } from 'react-icons/md';
import { AiOutlineMessage } from 'react-icons/ai';
import { useRouter } from 'next/router';

export const BottomNavComponent = () => {
  const router = useRouter();
  return (
    <>
      <Box
        sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }}
        borderTop="1px solid #848484"
      >
        <BottomNavigation showLabels bg="#FFF">
          <BottomNavigationAction label="ホーム" onClick={() => router.push('/offers')} icon={<AiFillHome size="50" />} mt="2rem" />
          <BottomNavigationAction label="募集をする" onClick={() => router.push('/createOffer')} icon={<MdOutlineCreate size="50" />} mt="2rem" />
          <BottomNavigationAction label="チャット一覧" onClick={() => router.push('/chats')} icon={<AiOutlineMessage size="50" />} mt="2rem" />
          <BottomNavigationAction label="マイページ" onClick={() => router.push('/mypage')} icon={<BsPersonCircle size="50" />} mt="2rem" />
        </BottomNavigation>
      </Box>
    </>
  );
};
