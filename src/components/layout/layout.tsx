import { PropsWithChildren } from "react";
import { Content } from "./content";
import { Header } from "./header";
import "./layout.scss";

export const Layout = ({ children }: PropsWithChildren) => {
  return (
    <div className="main-container">
      <Header />
      <Content>{children}</Content>
    </div>
  );
};
