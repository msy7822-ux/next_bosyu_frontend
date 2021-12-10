import { useMediaQuery } from 'react-responsive';
import { FaSearch } from 'react-icons/fa';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import { useDisclosure } from "@chakra-ui/hooks";
import { ImCross } from 'react-icons/im';
import { gql, useLazyQuery } from '@apollo/client';
import { useRef, useState } from "react";
import {
  Flex,
  Button,
  Text,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  Spacer,
  Input,
  Tag
} from '@chakra-ui/react';

export const Header = () => {
  const isMobileScreen = useMediaQuery({ query: '(max-width: 560px)' });
  const router = useRouter();
  const [session] = useSession();
  return (
    <>
      {/* モバイル用 */}
      {isMobileScreen && session &&
        <>
          <Flex h="7rem" w="100%">
            <Flex mx="auto" mt="1rem" color="#848484">
              <Box
                onClick={() => router.push('/')}
                cursor="pointer"
                w="60px"
                h="60px"
                backgroundImage="url(/offerLogo.svg)"
                backgroundSize="100%"
              />
              <Text fontFamily="Donau" ml="1rem" mt="1" fontSize="2.5rem">
                NextBosyu
              </Text>
            </Flex>
            <Box mt="2.3rem" mr="1.5rem" onClick={() => router.push('/search')}>
              <FaSearch color="#848484" size="30" />
            </Box>
          </Flex>
        </>
      } 
    </>
  );
};
