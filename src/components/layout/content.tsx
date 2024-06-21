import { Card } from "primereact/card";
import { ScrollTop } from "primereact/scrolltop";
import { PropsWithChildren } from "react";

export const Content = ({ children }: PropsWithChildren) => {
  return (
    <div className="mx-auto md:w-9 md:px-0">
      <Card className="main-content-card my-0 md:my-3 border-noround md:border-round-lg rgba-bg shadow-none">
        {children}
      </Card>
      <ScrollTop className="color-white primary-bg" />
    </div>
  );
};
