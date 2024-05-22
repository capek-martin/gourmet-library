import { PropsWithChildren } from "react";

export const Content = ({ children }: PropsWithChildren) => {
  return (
    <div className="content my-0 mx-auto px-2 md:w-8 md:px-0 min-h-full">
      {children}
    </div>
  );
};
