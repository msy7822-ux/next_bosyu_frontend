import { Select } from '@chakra-ui/react'

export const ChatSelect = ({ setTab }) => {
  const handleChageTab = (event) => {
    setTab(event.target.value);
  }
  return (
    <>
      <Select w="60%" mb="3rem" mx="auto" onChange={handleChageTab}>
        <option value='arived_applicants'>あなたに届いた応募一覧</option>
        <option value='applicants_you_created'>あなたの応募一覧</option>
      </Select>
    </>
  );
};
