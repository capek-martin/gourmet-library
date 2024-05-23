import { PropsWithChildren } from "react";
import { Content } from "./content";
import { Header } from "./header";
import "./layout.scss";
import { Loader } from "../loader/loader";
import { useSelector } from "react-redux";

export const Layout = ({ children }: PropsWithChildren) => {
  const isLoading = useSelector((state: any) => state.loading.isLoading);
  console.log(isLoading, "isLoading");
  return (
    <div className="main-container">
      <Header />
      {isLoading ? <Loader /> : <Content>{children}</Content>}
    </div>
  );
};
