import { Box, Text, Flex } from "@chakra-ui/react";
import { BsFillPersonFill } from "react-icons/bs";

export const ChatComponent = ({ message, chatroom, loginUserId }) => {
  // メッセージの送信者
  const senderId = message.sender === 'recruiter' ? chatroom.recruiter_id : chatroom.applicant_id;
  const isMyself = senderId === loginUserId;
  const createdDate = new Date(message.createdAt.seconds * 1000);
  const formatDate = (dt) => {
    var y = dt.getFullYear();
    var m = ('00' + (dt.getMonth()+1)).slice(-2);
    var d = ('00' + dt.getDate()).slice(-2);
    return (y + '-' + m + '-' + d + ` ${dt.getHours()}:${dt.getMinutes()}:${dt.getSeconds()}`);
  }

  return (
    <>
      {/* モバイル表示用のデザイン */}
      {isMyself &&
        <Box
          textAlign="right"
          m="2"
          mb="1rem"
          ml="18%"
          w="80%"
          p="2"
          borderBottom="1px solid #E5E5E5"
        >
          <Text>{message.message.replace(/[/s]/g, "\n")}</Text>
          <Box fontSize="80%" color="#A4A4A4">{formatDate(createdDate)}</Box>
        </Box>
      }
      {!isMyself &&
        <Flex
          w="80%"
          m="1"
          p="2"
          mb="1rem"
          borderBottom="1px solid #E5E5E5"
        >
          <Box mr="2" mt="1">
            <BsFillPersonFill color="#6A6A6A" size="30" />
          </Box>
          <Box>
            <Text>{message.message.replace(/[/s]/g, "\n")}</Text>
            <Text fontSize="80%" color="#A4A4A4">{formatDate(createdDate)}</Text>
          </Box>
      </Flex>
      }
    </>
  );
};
