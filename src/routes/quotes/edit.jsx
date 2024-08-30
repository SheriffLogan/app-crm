import { FC, PropsWithChildren } from "react";

import { QuotesFormModal } from "./components";

export const QuotesEditPage = ({ children }) => {
  return (
    <>
      <QuotesFormModal action="edit" />
      {children}
    </>
  );
};
