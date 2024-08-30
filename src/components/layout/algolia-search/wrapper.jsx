import { InstantSearch } from "react-instantsearch";

import { indexName, searchClient } from "@/providers";

export const AlgoliaSearchWrapper = ({
  children,
}) => {
  if (!searchClient) {
    return <>{children}</>;
  }

  return (
    <InstantSearch searchClient={searchClient} indexName={indexName}>
      {children}
    </InstantSearch>
  );
};
