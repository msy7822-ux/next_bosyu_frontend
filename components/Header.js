import { GiHamburgerMenu } from 'react-icons/gi';
import { useMediaQuery } from 'react-responsive';
import {
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuItemOption,
  MenuGroup,
  MenuOptionGroup,
  MenuIcon,
  MenuCommand,
  MenuDivider,
  Portal,
  Flex, Image, Spacer, Box, Link
} from '@chakra-ui/react';

export const Header = () => {
  const isMobileScreen = useMediaQuery({ query: '(max-width: 560px)' });
  const click = () => {
    console.log('クリック時の処理を走らせる');
  };

  return (
    <>
      <Flex h="7rem" bg="#9FCFAF" w="100%">
        <Link href='/'>
          <a>
            <Image outline="none" pl="3" pt="5" maxH="100%" maxW="80%" src="/nextBosyuLogo.png" alt="next bosyu logo" />
          </a>
        </Link>

        <Spacer />
        {/* モバイル用 */}
        {isMobileScreen &&
          <Menu>
            <MenuButton pr={5}>
              <GiHamburgerMenu size="40" color="#FFFFFF" />
            </MenuButton>
            <Portal>
              <MenuList>
                <MenuItem>募集をする</MenuItem>
                <MenuItem>マイページ</MenuItem>
                <MenuItem>検索を行う</MenuItem>
              </MenuList>
            </Portal>
          </Menu>
        }
      </Flex>
    </>
  );
};
