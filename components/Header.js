import { GiHamburgerMenu } from 'react-icons/gi';
import { FaBeer } from 'react-icons/fa';
import { useMediaQuery } from 'react-responsive';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Portal,
  Flex,
  Image,
  Spacer,
  Box,
  Button,
  HStack,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import { useRef } from 'react';

export const Header = ({ isError, buttonTitle }) => {
  const headerImage = useRef();
  const [session] = useSession();
  const isMobileScreen = useMediaQuery({ query: '(max-width: 560px)' });
  const router = useRouter();
  // クリック後の遷移先を設定
  const setButtonRouter = () => {
    if (buttonTitle === '募集をする') {
      router.push('/createOffer');
    } else if (buttonTitle === '募集一覧') {
      router.push('/offers');
    };
  }
  return (
    <>
      {!isError &&
        <Flex h="7rem" bg="#9FCFAF" w="100%">
        <Box cursor="pointer" ref={headerImage} onClick={() => router.push('/')}>
          <Image pl="3" pt="5" maxH="100%" maxW="80%" src="/nextBosyuLogo.png" alt="next bosyu logo" />
        </Box>

        <Spacer />
        {/* モバイル用 */}
        {isMobileScreen &&
          <Menu closeOnSelect={true} autoSelect={false}>
            <MenuButton pr={5}>
              <GiHamburgerMenu size="40" color="#FFFFFF" />
            </MenuButton>
            <Portal>
              {/* <MenuList bg="#9FCFAF" color="#FFF" border="4px solid #53AF5C"> */}
              <MenuList bg="#9FCFAF" color="#FFF" border="2px solid #8B8B8B">
                <MenuItem icon={<FaBeer />} borderBottom="1px solid #FFF" fontWeight="800" onClick={setButtonRouter}>
                  {buttonTitle}
                </MenuItem>
                {session &&
                  <MenuItem icon={<FaBeer />} borderBottom="1px solid #FFF" fontWeight="800">マイページ</MenuItem>
                }
                <MenuItem icon={<FaBeer />} fontWeight="800">検索を行う</MenuItem>
              </MenuList>
            </Portal>
          </Menu>
        }

        {/* デスクトップ用の表示 */}
        {!isMobileScreen &&
          <>
            <HStack color="#FFF" spacing="1rem" mr="1rem">
              <Button onClick={setButtonRouter} bg="#53AF5C">
                {buttonTitle}
              </Button>
              <Button bg="#53AF5C">マイページ</Button>
              <Button bg="#53AF5C">検索を行う</Button>
            </HStack>
          </>
        }
      </Flex>      
      }
    </>
  );
};
