import { Header } from "../components/Header";
import { Search } from "../components/Search";
import { Layout } from "../components/Layout";

const Serach = () => {
  return (
    <>
      <Header buttonTitles={["募集一覧", "募集をする", "マイページ"]} />
      <Layout>
        <Search />
      </Layout>
    </>
  );
}

export default Serach;
