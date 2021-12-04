import { GiHamburgerMenu } from 'react-icons/gi';
import { BsCheckLg } from 'react-icons/bs';
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

export const Header = ({ isError, buttonTitles }) => {
  const headerImage = useRef();
  const [session] = useSession();
  const isMobileScreen = useMediaQuery({ query: '(max-width: 560px)' });
  const router = useRouter();
  const isMypage = router.pathname === '/mypage';
  
  return (
    <>
      {/* エラーがあれば、ヘッダーを表示しない */}
      {!isError &&
        <Flex
          h="7rem"
          bg="#9FCFAF"
          w="100%"
        >
        <Box
          cursor="pointer"
          ref={headerImage}
          onClick={() => router.push('/')}
        >
          <Image
            pl="3"
            pt="5"
            maxH="100%"
            maxW="80%"
            src="/nextBosyuLogo.png"
            alt="next bosyu logo"
          />
        </Box>

        <Spacer />
        {/* モバイル用 */}
        {isMobileScreen &&
          <Menu
            closeOnSelect={true}
            autoSelect={false}
          >
            <MenuButton pr={5}>
              <GiHamburgerMenu size="40" color="#FFFFFF" />
            </MenuButton>
            <Portal>
              <MenuList
                bg="#9FCFAF"
                color="#FFF"
                border="2px solid #8B8B8B"
              >
                {buttonTitles?.includes('募集一覧') &&
                  <MenuItem
                  icon={<BsCheckLg />}
                  fontWeight="800"
                  onClick={() => router.push('/offers')}
                >
                  募集一覧
                  <hr color="#FFF" />
                </MenuItem>
                }
                {session && buttonTitles?.includes('募集をする') &&
                  <MenuItem
                    icon={<BsCheckLg />}
                    fontWeight="800"
                    onClick={() => router.push('/createOffer')}
                  >
                  募集をする
                  <hr color="#FFF" />
                </MenuItem>
                }
                {session && !isMypage &&
                  <MenuItem
                    icon={<BsCheckLg />}
                    fontWeight="800"
                    onClick={() => router.push('/mypage')}
                  >
                    マイページ
                    <hr color="#FFF" />
                  </MenuItem>
                }
                {buttonTitles.includes('募集を探す') &&
                  <MenuItem
                    icon={<BsCheckLg />}
                    fontWeight="800"
                    onClick={() => router.push('/search')}
                  >
                    募集を探す
                    <hr color="#FFF" />
                  </MenuItem>
                }
              </MenuList>
            </Portal>
          </Menu>
        }

        {/* デスクトップ用の表示 */}
        {!isMobileScreen &&
          <>
            <HStack color="#FFF" spacing="1rem" mr="1rem">
              {/* <Button onClick={setButtonRouter} bg="#53AF5C"> */}
                {/* {buttonTitle} */}
              {/* </Button> */}
              <Button bg="#53AF5C">マイページ</Button>
              <Button onClick={() => router.push('/search')} bg="#53AF5C">検索を行う</Button>
            </HStack>
          </>
        }
      </Flex>      
      }
    </>
  );
};
