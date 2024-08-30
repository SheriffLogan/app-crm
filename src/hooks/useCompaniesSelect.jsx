import { useSelect } from "@refinedev/antd";

import gql from "graphql-tag";


const COMPANIES_SELECT_QUERY = gql`
    query CompaniesSelect(
        $filter: CompanyFilter!
        $sorting: [CompanySort!]
        $paging: OffsetPaging!
    ) {
        companies(filter: $filter, sorting: $sorting, paging: $paging) {
            nodes {
                id
                name
                avatarUrl
            }
        }
    }
`;

export const useCompaniesSelect = () => {
  return useSelect({
    resource: "companies",
    optionLabel: "name",
    meta: {
      gqlQuery: COMPANIES_SELECT_QUERY,
    },
  });
};
