import React from "react";
import { DeleteButton, EditButton, FilterDropdown } from "@refinedev/antd";
import { getDefaultFilter } from "@refinedev/core";
import { SearchOutlined, EyeOutlined } from "@ant-design/icons";
import { Input, Select, Space, Table } from "antd";

import { CustomAvatar, PaginationTotal, Text } from "@/components";
import { useContactsSelect } from "@/hooks/useContactsSelect";
import { useUsersSelect } from "@/hooks/useUsersSelect";
import { currencyNumber } from "@/utilities";
import { AvatarGroup } from "./avatar-group";

export const CompaniesTableView = ({ tableProps, filters }) => {
  const { selectProps: selectPropsUsers } = useUsersSelect();
  const { selectProps: selectPropsContacts } = useContactsSelect();

  return (
    <Table
      {...tableProps}
      pagination={{
        ...tableProps.pagination,
        pageSizeOptions: ["12", "24", "48", "96"],
        showTotal: (total) => (
          <PaginationTotal total={total} entityName="companies" />
        ),
      }}
      rowKey="id"
    >
      <Table.Column
        dataIndex="name"
        title="Company title"
        defaultFilteredValue={getDefaultFilter("id", filters)}
        filterIcon={<SearchOutlined />}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Input placeholder="Search Company" />
          </FilterDropdown>
        )}
        render={(_, record) => {
          return (
            <Space>
              <CustomAvatar
                shape="square"
                name={record.name}
                src={record.avatarUrl}
              />
              <Text style={{ whiteSpace: "nowrap" }}>{record.name}</Text>
            </Space>
          );
        }}
      />
      <Table.Column
        dataIndex={["salesOwner", "id"]}
        title="Sales Owner"
        defaultFilteredValue={getDefaultFilter("salesOwner.id", filters)}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Select
              placeholder="Search Sales owner"
              style={{ width: 220 }}
              {...selectPropsUsers}
            />
          </FilterDropdown>
        )}
        render={(_, record) => {
          const salesOwner = record.salesOwner;
          return (
            <Space>
              <CustomAvatar name={salesOwner.name} src={salesOwner.avatarUrl} />
              <Text style={{ whiteSpace: "nowrap" }}>{salesOwner.name}</Text>
            </Space>
          );
        }}
      />
      <Table.Column
        dataIndex={"totalRevenue"}
        title="Open deals amount"
        render={(_, company) => {
          return (
            <Text>
              {currencyNumber(company.dealsAggregate[0]?.sum?.value || 0)}
            </Text>
          );
        }}
      />
      <Table.Column
        dataIndex={["contacts", "id"]}
        title="Related Contacts"
        defaultFilteredValue={getDefaultFilter("contacts.id", filters, "in")}
        filterDropdown={(props) => (
          <FilterDropdown {...props}>
            <Select
              mode="multiple"
              placeholder="Search related contacts"
              style={{ width: 220 }}
              {...selectPropsContacts}
            />
          </FilterDropdown>
        )}
        render={(_, record) => {
          const value = record.contacts;
          const avatars = value.nodes.map((contact) => {
            return {
              name: contact.name,
              src: contact.avatarUrl || undefined,
            };
          });

          return <AvatarGroup avatars={avatars} size={"small"} />;
        }}
      />
      <Table.Column
        fixed="right"
        dataIndex="id"
        title="Actions"
        render={(value) => (
          <Space>
            <EditButton
              icon={<EyeOutlined />}
              hideText
              size="small"
              recordItemId={value}
            />
            <DeleteButton hideText size="small" recordItemId={value} />
          </Space>
        )}
      />
    </Table>
  );
};
