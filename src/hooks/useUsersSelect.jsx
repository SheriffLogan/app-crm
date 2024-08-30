import { useSelect } from "@refinedev/antd";

import gql from "graphql-tag";


const USERS_SELECT_QUERY = gql`
    query UsersSelect(
        $filter: UserFilter!
        $sorting: [UserSort!]
        $paging: OffsetPaging!
    ) {
        users(filter: $filter, sorting: $sorting, paging: $paging) {
            nodes {
                id
                name
                avatarUrl
            }
        }
    }
`;

export const useUsersSelect = () => {
  return useSelect({
    resource: "users",
    optionLabel: "name",
    meta: {
      gqlQuery: USERS_SELECT_QUERY,
    },
  });
};
