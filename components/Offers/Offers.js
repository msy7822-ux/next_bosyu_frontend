import { Box, Text, Image, Button } from "@chakra-ui/react";
import { useMediaQuery } from 'react-responsive';
import { GiTalk } from 'react-icons/gi';

export const Offers = ({ id, name, title, content, imageUrl,tags }) => {
  const isMobileScreen = useMediaQuery({ query: '(max-width: 560px)' });
  console.log(isMobileScreen);

  return (
    <>
      {isMobileScreen &&
        <>
          <Box
            textAlign="center"
            p="1.5rem"
            bg="#9FCFAF"
            borderWidth="1px"
            borderRadius="30"
          >
            <Text
              color="#FFF"
              fontWeight="bold"
              px="1rem"
              pb="1rem"
              textAlign="center"
            >
              {title}
            </Text>
            <hr color="#FFF" />
            <Box
              mt="1rem"
              p="1rem"
              bg="#E1F8D9"
              border="none"
              borderRadius="30"
            >
              <Text color="#818181">{content}</Text>
            </Box>
            <Button
              px="2.5rem"
              py="1rem"
              bg="#53AF5C"
              mt="2rem"
              borderRadius="20"
              color="#FFF"
            >
              話を聞いてみる &nbsp;&nbsp; <GiTalk size="20" />
            </Button>
          </Box>
          <br />
        </>
      }
    </>
  );
};
