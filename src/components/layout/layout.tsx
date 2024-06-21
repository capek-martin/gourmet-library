import { PropsWithChildren } from "react";
import { Content } from "./content";
import { Header } from "./header";
import "./layout.scss";
import { Loader } from "../loader/loader";
import { useSelector } from "react-redux";

export const Layout = ({ children }: PropsWithChildren) => {
  const isLoading = useSelector((state: any) => state.loading.isLoading);

  return (
    <div className="h-screen flex flex-column">
      <div>
        <Header />
      </div>
      <div className="h-full">
        {isLoading ? <Loader /> : <Content>{children}</Content>}
      </div>
    </div>
  );
};
