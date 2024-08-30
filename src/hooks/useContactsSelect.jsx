import { useSelect } from "@refinedev/antd";

import gql from "graphql-tag";

const CONTACTS_SELECT_QUERY = gql`
    query ContactsSelect(
        $filter: ContactFilter!
        $sorting: [ContactSort!]
        $paging: OffsetPaging!
    ) {
        contacts(filter: $filter, sorting: $sorting, paging: $paging) {
            nodes {
                id
                name
                avatarUrl
            }
        }
    }
`;

export const useContactsSelect = (params) => {
  const { filters } = params || {};
  return useSelect({
    resource: "contacts",
    optionLabel: "name",
    filters,
    meta: {
      gqlQuery: CONTACTS_SELECT_QUERY,
    },
  });
};
