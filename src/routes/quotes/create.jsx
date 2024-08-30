import { FC, PropsWithChildren } from "react";

import { QuotesFormModal } from "./components";

export const QuotesCreatePage = ({ children }) => {
  return (
    <>
      <QuotesFormModal action="create" />
      {children}
    </>
  );
};
