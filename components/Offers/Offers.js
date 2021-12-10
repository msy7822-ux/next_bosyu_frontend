import { Box, Text, Button, Tag, Link } from "@chakra-ui/react";
import { useMediaQuery } from 'react-responsive';
import { GiTalk } from 'react-icons/gi';
import { useRouter } from "next/router";
import { useRef, useState } from "react";
import gql from "graphql-tag";
import { useMutation } from "@apollo/client";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
} from '@chakra-ui/react'
import { useSession } from "next-auth/client";

export const Offers = ({offer, recruiterToken}) => {
  const [session] = useSession();
  const isMyBosyu = recruiterToken === session?.accessToken
  const isMobileScreen = useMediaQuery({ query: '(max-width: 560px)' });
  const router = useRouter();
  const hearButton = useRef();
  const endBosyuButton = useRef();

  const isMypage = router.pathname === '/mypage';
  const createdDate = offer.createdAt
  const date = new Date(createdDate);

  const [isOpen, setIsOpen] = useState(false)
  const onClose = () => setIsOpen(false)
  const cancelRef = useRef()

  const formatDate = (dt) => {
    var y = dt.getFullYear();
    var m = ('00' + (dt.getMonth()+1)).slice(-2);
    var d = ('00' + dt.getDate()).slice(-2);
    return (y + '-' + m + '-' + d);
  }

  const tags = (offerTag) => {
    if (offerTag === null || offerTag === undefined || offerTag === '') {
      return;
    }

    let newofferTag = offerTag.slice(1);
    newofferTag = newofferTag.split('#');
    return newofferTag;
  };

  const UNDISPLAY_OFFER = gql`
    mutation {
      undisplayOffer (input: {
        id: ${offer.id}
      }) {
        jobOfferSlip {
          id
        }  
      }
    }
  `;

  const [undisplayBosyuMutate] = useMutation(UNDISPLAY_OFFER);

  const undisplayBosyu = () => {
    onClose();
    undisplayBosyuMutate();
    router.push('/mypage');
  };

  const bosyuContent = offer.content.replace(/[/s/s/s]+/g, "\n\n");

  return (
    <>
      {/* モバイル用 */}
      {isMobileScreen &&
        <>
          <Box
            p="1.5rem"
            borderRadius="10"
          >
            <Text
              color="#848484"
              fontWeight="bold"
              px="1rem"
              pb="1rem"
              textAlign="center"
            >
              {offer.title.replace(/[/s]/g, "\n")}
            </Text>
            <hr color="#FFF" />
            <Box
              mt="1rem"
              p="1rem"
              bg="#F3F3F3"
              border="none"
              borderRadius="10"
            >
              <Text textAlign="left" whiteSpace="pre-wrap" color="#818181">
                {bosyuContent}
              </Text>
            </Box>
            <Box mt="1rem" textAlign="left">
              {
                tags(offer?.tag)?.map((tag, key) => {
                  return (
                    <>
                      <Tag key={key} variant='solid' bg='#A0AEC0' m="1">#{tag}</Tag>
                    </>
                  );
                })
              }
            </Box>
            <Text textAlign="center" mt="1rem" color="#818181">募集掲載日: {formatDate(date)}</Text>
            {/* マイページでは、「話を聞いてみる」ボタンを表示にしない */}
            {!isMypage && !isMyBosyu &&
              <Box textAlign="center">
                <Button
                ref={hearButton}
                px="2.5rem"
                py="1rem"
                mt="1rem"
                bg="#FFF"
                borderRadius="5"
                color="#818181"
                border="0.5px solid #C2C2C2"
                onClick={() => {
                  router.push(`/offers/${offer.id}/chat?offer=${offer.id}&recruiter=${offer?.corporate?.user?.id}`);
                }}
                >
                  話を聞いてみる &nbsp;&nbsp; <GiTalk size="20" />
                </Button>
              </Box>
            }
            {isMypage &&
              <>
                <Button
                  ref={endBosyuButton}
                  colorScheme='red'
                  onClick={() => {
                    setIsOpen(true);
                  }}
                  bg="#F56565"
                  color="#FFF"
                  my="1rem"
                >
                  募集の掲載を終了する
                </Button>
                <br />
                <AlertDialog
                  isOpen={isOpen}
                  leastDestructiveRef={cancelRef}
                  onClose={onClose}
                >
                  <AlertDialogOverlay>
                    <AlertDialogContent m="1rem">
                      <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                        こちらの募集を掲載を終了しますか？
                      </AlertDialogHeader>
      
                      <AlertDialogBody>
                        一度掲載を終了してしまうと、再喝することができませんがよろしいでしょうか？？
                      </AlertDialogBody>
      
                      <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose}>
                          キャンセル
                        </Button>
                        <Button colorScheme='red' onClick={undisplayBosyu} ml={3}>
                          掲載終了する
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialogOverlay>
                </AlertDialog>
              </>
            }
          </Box>
        </>
      }
    </>
  );
};
