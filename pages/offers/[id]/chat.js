import { db } from '../../../utils/firebase/config';
import React, { useEffect, useLayoutEffect, useState, useRef } from 'react';
import { Header } from '../../../components/Header';
import { Layout } from '../../../components/Layout';
import { ChatComponent } from '../../../components/ChatComponent';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/client';
import { MdSend } from 'react-icons/md';
import {
  Button,
  Box,
  Text,
  Textarea,
  useToast,
  Flex,
} from '@chakra-ui/react';
import {
  collection,
  onSnapshot,
  getDocs,
  doc,
  setDoc,
} from 'firebase/firestore';
import axios from 'axios';

const ApplicantChat = (props) => {
  const router = useRouter();
  const offer_id = parseInt(router.query.offer, 10);
  const recruiter_id = parseInt(router.query.recruiter, 10);
  const [session] = useSession();
  const [message, setMessage] = useState('');// => ユーザーが入力したメッセージ
  const [messages, setMessages] = useState([]);// => Firestoreから取得した特定のchatroomの全てのメッセージ
  const [chatroom, setChatroom] = useState(null);
  const inputChatMessage = useRef();
  const chatBottomRef = useRef();
  const applicant_id = +router.query.applicant;
  const [loginUserId, setLoginUserId] = useState(null);
  const [offerTitle, setOfferTitle] = useState('');
  const [recruiterName, setRecuruiterName] = useState('');
  const toast = useToast();
  const [loading, setLoading] = useState(true);

  // TODO Railsからログインユーザー情報を取得し、そのユーザーのチャット情報をFirestoreから取得している。
  const getLoginUserId = async () => {
    await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/myself/`, { params: { token: session.accessToken } }).then(res => {
      const userId = res.data.id
      setLoading(false);
      setLoginUserId(res.data.id);
      // TODO chatroomを全て取得して、その中から今ユーザーが見ているチャットルームを探す。
      onSnapshot(collection(db, 'chatrooms'), {
        next: (sn) => {
          const chatrooms = sn.docs.filter((doc) => {
            // TODO 一人の応募者と一人の募集者とのトークに限定する
            const applicant_condition = doc.data().offer_id === offer_id && recruiter_id === doc.data().recruiter_id && session?.accessToken === doc.data().applicant_token
            const recruiter_condition = doc.data().offer_id === offer_id && doc.data().recruiter_id === userId

            return applicant_condition || recruiter_condition;
          });
  
          // TODO chatroomが見つかったとき
          if (chatrooms[0]) {
            // TODO すでにStateの値に入っていたらStateセットしない。=> あんま関係ないかも、、、、、、
            if (chatroom?.id !== chatrooms[0].data().id) {
              setChatroom(chatrooms[0].data());
            }

            // TODO 一つに絞られたチャットルームのメッセージを全件取得する
            const chatroom_id = chatrooms[0].data().id;
            onSnapshot(collection(db, 'messages'), {
              next: (snap) => {
                const messagesArr = snap.docs.filter((docu) => {
                    const datum = docu.data();
                    return datum.chatroom_id === chatroom_id;
                });
  
                const messageContents = messagesArr.map((message) => { return message.data() })
                // TODO Stateにすでにセットされている場合、Stateの値の重複を防ぐため、スルーする
                if (messageContents[0] && !messages.map((msg) => { return msg.id }).includes(messageContents[0].id)) {
                  const sortedMessages = messageContents.sort((a, b) => {
                    if (a.createdAt > b.createdAt) return 1;
                    if (a.createdAt < b.createdAt) return -1;
                    if (a.createdAt === b.createdAt) return 0;
                  });
                  setMessages([...messages, sortedMessages].flat());
                  chatBottomRef?.current?.scrollIntoView();
                }
              }
            });
          }
        }
      });
    })
  }

  useLayoutEffect(() => {
    if (offer_id !== NaN) {
      axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/job_offer_slips/${offer_id}?token=${session?.accessToken}&session=${!!session}`).then((res) => {
        setOfferTitle(res.data.title);
        setRecuruiterName(res.data.name)
      })
    }
  }, [offer_id, session])

  useEffect(() => {
    getLoginUserId();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = async() => {
    if (message === '' || message === null || message === undefined) {
      return;
    }

    // TODO chatroomsコレクションを覗いて、同じoffer_id, recruiter_id, applicant_tokenのドキュメントが存在するかどうかチェックする
    const docsRef = collection(db, 'chatrooms');
    const snap = await getDocs(docsRef);
    const result = snap.docs.filter((doc) => {

      const applicant_condition = doc.data().offer_id === offer_id && doc.data().recruiter_id === recruiter_id && doc.data().applicant_token === session?.accessToken;
      const recruiter_condition = doc.data().offer_id === offer_id && doc.data().recruiter_id === loginUserId && doc.data().applicant_id === applicant_id

      return applicant_condition || recruiter_condition;
    });

    let messageData = {}
    if (result[0] && result[0].data().id) {
      // TODO もしドキュメント（chatroom）が見つかれば、特に何もせず、messagesコレクションのドキュメントをそのchatroom_idで作成する
      const messagesRef = collection(db, 'messages');
      const messageSnap = await getDocs(messagesRef);
      // TODO chatroomに紐づくmessageのレコード数を取得する
      const numOfMessages = messageSnap.docs.filter((msgSnap) => {
        return msgSnap.data().chatroom_id === result[0].data().id
      }).length;   

      messageData = {
        id: numOfMessages + 1,
        chatroom_id: result[0].data().id,
        sender: loginUserId === recruiter_id ? 'recruiter' : 'applicant',
        message: message,
        createdAt: new Date()
      }
    } else {
      // TODO もしドキュメント（chatroom）が見つからなければ、chatroomsのドキュメントを作成し、それからmessagesコレクションのドキュメントを作成する。
      const id = snap.docs.length + 1;
      const chatroomData = {
        id: id,
        applicant_token: session?.accessToken,
        applicant_id: loginUserId,
        offer_id: offer_id,
        offer_title: offerTitle,
        recruiter_name: recruiterName,
        recruiter_id: recruiter_id
      }
      const chatroomDocRef = doc(collection(db, 'chatrooms'))
      setDoc(chatroomDocRef, chatroomData);

      messageData = {
        id: 1,
        chatroom_id: id,
        sender: loginUserId === recruiter_id ? 'recruiter' : 'applicant',
        message: message,
        createdAt: new Date()
      }
    }
    // TODO ※募集の作者は、別途チャット一覧ページを用意する。（そこからチャットを覗くことができるようにする。）
    const messageDocRef = doc(collection(db, 'messages'))
    setDoc(messageDocRef, messageData);
    chatBottomRef?.current?.scrollIntoView();
    inputChatMessage.current.value = '';
  }

  const handleChangeMessage = (event) => {
    let value = event.target.value
    if (!!event.target.value.match(/\n/)) {
      value = value.replace(/\n/g, "/s")
    }
    setMessage(value);
  }

  return (
    <>
      <Header buttonTitles={['募集をする', '募集を探す', '募集一覧']} />
      <Layout>
        <Box>
          <Box
            // color="#848484"
            bg="#848484"
            p="2"
            borderRadius="5"
            color="#FFF"
            fontWeight="bold"
            mx="3rem"
            mb="1rem"
          >
            <Text>{offerTitle.replace(/[/s]/g, "\n")}</Text>
          </Box>
          <Text
            fontWeight="bold"
            color="#848484"
            textAlign="right"
          >
            by {recruiterName}
          </Text>
          <Box>
            {/* モバイル表示用のデザイン */}
            <Box
              border="1px solid #CFCFCF"
              h="50vh"
              overflow="auto"
            >
              {messages.length !== 0 &&
                messages.map((message, key) => {
                  return (
                    <React.Fragment key={key}>
                      <ChatComponent
                        message={message}
                        chatroom={chatroom}
                        loginUserId={loginUserId}
                      />
                    </React.Fragment>
                  );
                })
              }
               <Box ref={chatBottomRef}></Box>
            </Box>
          </Box>
          <Flex mb="10rem" h="4rem">
            <Textarea
              ref={inputChatMessage}
              mt="3rem"
              resize="none"
              onChange={handleChangeMessage}
            />
            <Button onClick={sendMessage} mt="3rem" h="5rem">
              <MdSend size="30" />
            </Button>
          </Flex>
        </Box>
      </Layout>
    </>
  );
}

export default ApplicantChat;
