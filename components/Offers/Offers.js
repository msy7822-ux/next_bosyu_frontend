import { Box, Text, Image, Button } from "@chakra-ui/react";
import { useMediaQuery } from 'react-responsive';
import { GiTalk } from 'react-icons/gi';

export const Offers = ({ id, name, title, content, imageUrl,tags }) => {
  const isMobileScreen = useMediaQuery({ query: '(max-width: 560px)' });

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
            <Text color="#FFF" pb="1rem" fontWeight="700">{title}</Text>
            <hr color="#FFF" />
            <Box
              bg="#E1F8D9"
              mt="1.5rem"
              borderRadius="10"
            >
              <Text color="#818181" p="1rem">{content}</Text>
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
