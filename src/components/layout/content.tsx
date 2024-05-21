import { PropsWithChildren } from "react";

export const Content = ({ children }: PropsWithChildren) => {
  return (
    <div className="content w-12 my-0 mx-auto px-2 md:w-8 md:px-0">
      {children}
    </div>
  );
};
