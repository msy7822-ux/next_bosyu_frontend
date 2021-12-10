import { Box, Text, Link, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { db } from "../utils/firebase/config";
import { useSession } from "next-auth/client";
import axios from "axios";
import { Layout } from "../components/Layout";
import { Header } from "../components/Header";
import { collection, onSnapshot } from 'firebase/firestore';
import { ChatSelect } from "../components/ChatSelect";
import { BsChatDotsFill } from "react-icons/bs";

const Chats = () => {
  const [session] = useSession();
  const [chatrooms, setChatrooms] = useState(null);// => 自分が作成した募集に集まったチャット
  const [chatroom2, setChatroom2] = useState(null);// => 自分が応募したチャット
  const [tab, setTab] = useState('arived_applicants');

  const getUserToken = async () => {
    await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/myself`, { params: { token: session?.accessToken } }).then((res) => {
      onSnapshot(collection(db, 'chatrooms'), {
        next: (sn) => {
          const chatroomsForRecruiter = sn.docs.filter((doc) => {
            // TODO recruiter IDが自分（ログインユーザー）のものであるチャットを全件取得する
            return doc.data().recruiter_id === res.data.id;
          })
          // TODO 自分が作成した募集で作成された全てのチャットルームを取得
          const chatroomData = chatroomsForRecruiter.map((doc) => { return doc.data() });
          setChatrooms(chatroomData);

          const chatroomForApplicant = sn.docs.filter((doc) => {
            return doc.data().applicant_id === res.data.id;
          });

          const createdMyChat = chatroomForApplicant.map((doc) => { return doc.data() });
          setChatroom2(createdMyChat);
        }
      });
    })
  }

  useEffect(() => {
    getUserToken();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (chatrooms === null || chatroom2 === null) return <p>Loading...</p>

  return (
    <>
      <Header />
      <ChatSelect setTab={setTab} />
      <Layout>
        {tab === 'arived_applicants' &&
          <>
            <Box>あなたが作成した募集に届いたチャット一覧</Box>
            <Box>
              {chatrooms &&
                chatrooms.map((chat, key) => {
                  return (
                    <Box mt="1rem" key={key}>
                      <hr />
                      <Link href={`/offers/${chat.offer_id}/chat?offer=${chat.offer_id}&recruiter=${chat.recruiter_id}&applicant=${chat.applicant_id}`}>
                        <a>
                          <Flex>
                            <Box mt="2" mx="2" mr="1rem">
                              <BsChatDotsFill color="#A4A4A4" size="30" />
                            </Box>
                            <Box color="#A4A4A4" fontWeight="bold">
                              <Text>募集のID: {chat.offer_id}</Text>
                              <Text>応募者: {chat.applicant_id}</Text>
                            </Box>
                          </Flex>
                        </a>
                      </Link>
                      <hr />
                    </Box>
                  );
                })
              }
            </Box>
          </>
        }
        {tab === 'applicants_you_created' &&
          <>
            <Box>あなたが募集者として送信しているチャット一覧</Box>
            <Box>
              {chatroom2 &&
                chatroom2.map((chat, key) => {
                  return (
                    <Box mt="1rem" key={key}>
                      <hr />
                      <Link href={`/offers/${chat.offer_id}/chat?offer=${chat.offer_id}&recruiter=${chat.recruiter_id}&applicant=${chat.applicant_id}`}>
                        <a>
                          <Flex>
                            <Box mt="2rem" mx="2" mr="1rem">
                              <BsChatDotsFill color="#A4A4A4" size="30" />
                            </Box>
                            <Box color="#A4A4A4" fontWeight="bold">
                              <Text>募集のID: {chat.offer_id}</Text>
                              <Text>募集のタイトル: {chat.offer_title.replace(/[/s]/g, "\n")}</Text>
                              <Text>募集者: {chat.recruiter_name}</Text>
                            </Box>
                          </Flex>
                        </a>
                      </Link>
                      <hr />
                    </Box>
                  );
                })
              }
            </Box>
          </>
        }
      </Layout>
    </>
  );
}

export default Chats;
