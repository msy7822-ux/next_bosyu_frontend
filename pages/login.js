import { Box, Text, Image, Button, Input } from "@chakra-ui/react"
import axios from "axios";
import { signIn } from "next-auth/client";
import { useAlert } from 'react-alert'
import { useRef, useState } from "react";

const Login = (props) => {
  const alert = useAlert();
  const [email, setEmail] = useState('');
  const inputRef = useRef();

  const handeChangeEmail = (event) => {
    setEmail(event.target.value);
  }

  const submitEmail = () => {
    if (email === '') {
      alert.error('[メールアドレスが入力されていません。]');
      return;
    }
    axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users`, { email: email }).then((res) => {
      console.log(res);
      alert.show('[メールを送信しました。ご確認ください。また、メールが「迷惑メール」に送信されてしまうことがありますのでご確認ください。]');
      
      // 入力欄を空にする。
      inputRef.current.value = '';
    }).catch((err) => {
      console.log('error is ', err);
    })
  };  

  return (
    <>
      <Box bg="#9FCFAF" h="100vh">
        <Box width="60%" m='auto' textAlign="center">
          <Image src="/nextBosyuLogo.png" alt="next bosyu logo" />
          <Text color="#FFFFFF">お好きな方法でNextBosyuをはじめましょう！</Text>
          <Button onClick={() => signIn()} border="none" bg='#7BBBEA' h="70" w="400" px="100" borderRadius="30" color="#FFFFFF" cursor='pointer'>Twitterで登録</Button>
          <Text>OR</Text>

          <Input ref={inputRef} placeholder='パスワードを入力してください' p="20" border="none" borderRadius="5" w="40rem" mb="20" onChange={handeChangeEmail} />
          <br />
          <Button onClick={submitEmail} border="none" bg='#4E5052' h="70" w="400" px="100" borderRadius="30" color="#FFFFFF" cursor='pointer'>メールアドレスで登録</Button>
        </Box>
      </Box>
    </>
  );
};

export default Login;
