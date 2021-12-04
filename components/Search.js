import { Box, Text, Tag, Input, Button } from "@chakra-ui/react";
import { useMediaQuery } from 'react-responsive';
import { useRef, useState } from "react";
import { gql, useLazyQuery } from '@apollo/client';
import { ImCross } from 'react-icons/im';
import { FaSearch } from 'react-icons/fa';
import { MdTextSnippet } from 'react-icons/md';
import { Offers } from "./Offers/Offers";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  Flex,
  Spacer,
} from '@chakra-ui/react';
import { useDisclosure } from "@chakra-ui/hooks";

export const Search = (props) => {
  const isMobileScreen = useMediaQuery({ query: '(max-width: 560px)' });
  const submitButton = useRef();
  const [keyword, setKeyword] = useState("");
  // const [result, setResult] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const SEARCH_BOSYU = gql`
    query {
      searchJobOfferSlips(keyword: "${keyword}") {
        id,
        title,
        content,
        createdAt,
        tag
      }
    }
  `;

  const [searchBosyu, {loading, error, data}] = useLazyQuery(SEARCH_BOSYU);

  const handleChangeKeyword = (event) => {
    setKeyword(event.target.value);
  }

  const handleSubmit = () => {
    if (keyword === "") {
      onClose();
      return;
    }

    submitButton.current.style.background = "#9FCFAF";
    searchBosyu();
    onClose();
  };

  // if (!props.isVisible) return <p>検索フォームを表示しない</p>;
  return (
    <>
      <Button
        my="1rem"
        py="1"
        px="5rem"          
        bg="#9FCFAF"
        color="#FFF"
        leftIcon={<FaSearch />}
        onClick={onOpen}
        borderRadius="10"
      >
        検索を行う
      </Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay bg="#CFCFCF" />
        <ModalContent m="3" mt="5rem">
          <Box
            bg="#FAF6F6"
            p="1rem"
            borderRadius="10"
          >
            <Flex>
              <Tag
                fontWeight="bold"
                fontSize="20"
                px="3rem"
                py="1"
                bg="#9FCFAF"
                color="#FFF"
              >
                募集検索
              </Tag>
              <Spacer />
              <Box mb="1rem" onClick={onClose}>
                <ImCross color="#9FCFAF" />
              </Box>
            </Flex>
            <Box>
              <Tag
                mt="1rem"
                mb="1"
                bg="#C4C4C4"
                color="#FFF"
              >
                キーワード
              </Tag>
              <Input
                onChange={handleChangeKeyword}
                bg="#FFF"
                placeholder="例：リモートワーク"
              />
              <Button
                ref={submitButton}
                onClick={handleSubmit}
                mt="1rem"
                bg="#9FCFAF"
                color="#FFF"
              >
                絞り込み
              </Button>
            </Box>
          </Box>
        </ModalContent>
      </Modal>

      <Box>
        {data?.searchJobOfferSlips && data?.searchJobOfferSlips?.length !== 0 &&
          <>
            <Box
              mx="3rem"
              my="1rem"
              py="2"
              fontWeight="bold"
              borderRadius="10"
              textAlign="center"
              bg="#E7E7E7"
              color="#757575"
            >
              {/* <MdTextSnippet /> */}
              <Text ml="1rem">※{data?.searchJobOfferSlips?.length}件の募集が見つかりました。</Text>
            </Box>
            {data?.searchJobOfferSlips.map((offer, key) => {
              return (
                <Box key={key}>
                  <Offers {...offer} />
                </Box>
              );
            })}
          </>
        }

        {data?.searchJobOfferSlips && data?.searchJobOfferSlips?.length === 0 &&
          <Text mt="3rem" textAlign="center">検索結果がありません。</Text>
        }
        {!data?.searchJobOfferSlips &&
          <Text mt="3rem" textAlign="center">検索結果がありません。</Text>
        }
      </Box>
    </>
  );
};
