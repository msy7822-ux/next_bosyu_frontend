import { Box, Text, Button, Tag } from "@chakra-ui/react";
import { useMediaQuery } from 'react-responsive';
import { GiTalk } from 'react-icons/gi';
import { useRouter } from "next/router";
import { useRef } from "react";

export const Offers = (props) => {
  const isMobileScreen = useMediaQuery({ query: '(max-width: 560px)' });
  const router = useRouter();
  const hearButton = useRef();
  const isMypage = router.pathname === '/mypage';
  const createdDate = props.createdAt
  const date = new Date(createdDate);

  const formatDate = (dt) => {
    var y = dt.getFullYear();
    var m = ('00' + (dt.getMonth()+1)).slice(-2);
    var d = ('00' + dt.getDate()).slice(-2);
    return (y + '-' + m + '-' + d);
  }

  const tags = (propsTag) => {
    if (propsTag === null || propsTag === undefined) {
      return;
    }

    let newPropsTag = propsTag.slice(1);
    newPropsTag = newPropsTag.split('#');
    return newPropsTag;
  };

  return (
    <>
      {/* デスクトップ */}
      {!isMobileScreen &&
        <>
          <Box
            w="21rem"
            p="1rem"
            bg="#9FCFAF"
            textAlign="center"
            borderWidth="1px"
            borderRadius="lg"
          >
            <Text color="#FFF" pb="1rem" fontWeight="700">{props.title}</Text>
            <hr color="#FFF" />
            <Box
              bg="#E1F8D9"
              mt="1.5rem"
              borderRadius="10"
            >
              <Text color="#818181" p="1rem">{props.content}</Text>
            </Box>
            <Button
              bg="#53AF5C"
              borderRadius="30"
              mt="1rem"
              color="#FFF"
            >
              話を聞いてみる &nbsp;&nbsp; <GiTalk size="20" />
            </Button>
          </Box>
        </>
      }

      {/* モバイル用 */}
      {isMobileScreen &&
        <>
          <Box
            textAlign="center"
            p="1.5rem"
            bg="#9FCFAF"
            borderWidth="1px"
            borderRadius="10"
          >
            <Text
              color="#FFF"
              fontWeight="bold"
              px="1rem"
              pb="1rem"
              textAlign="center"
            >
              {props.title}
            </Text>
            {/* <Text>offer_id: {props.id}</Text> */}
            <hr color="#FFF" />
            <Box
              mt="1rem"
              p="1rem"
              bg="#E1F8D9"
              border="none"
              borderRadius="10"
            >
              <Text color="#818181">{props.content}</Text>
            </Box>
            {/* タグを表示する */}
            <Box textAlign="left">
              {
                tags(props?.tag)?.map((tag, key) => {
                  return (
                    <>
                      <Tag key={key} variant='solid' colorScheme='teal' m="1">#{tag}</Tag>
                    </>
                  );
                })
              }
            </Box>
            <Text mt="1rem" color="#FFF">募集掲載日: {formatDate(date)}</Text>
            {/* マイページでは、「話を聞いてみる」ボタンを表示にしない */}
            {!isMypage &&
              <Button
                ref={hearButton}
                px="2.5rem"
                py="1rem"
                bg="#53AF5C"
                mt="1rem"
                borderRadius="20"
                color="#FFF"
                onClick={() => {
                  hearButton.current.style.background = "#53AF5C"
                }}
                >
                話を聞いてみる &nbsp;&nbsp; <GiTalk size="20" />
              </Button>
            }
          </Box>
          <br />
        </>
      }
    </>
  );
};
