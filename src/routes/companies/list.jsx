import React, { useState } from "react";

import { List, useTable } from "@refinedev/antd";
import { Form, Grid, Input, Radio, Space, Spin } from "antd";
import debounce from "lodash/debounce";

import { ListTitleButton } from "@/components";
import { CompaniesTableView, CompaniesCardView } from "./components";
import { COMPANIES_TABLE_QUERY } from "./queries";

import { SearchOutlined, AppstoreOutlined, UnorderedListOutlined } from "@ant-design/icons";

export const CompanyListPage = ({ children }) => {
  const [view, setView] = useState("card");
  const screens = Grid.useBreakpoint();

  const {
    tableProps,
    tableQuery: tableQueryResult,
    searchFormProps,
    filters,
    sorters,
    setCurrent,
    setPageSize,
    setFilters,
  } = useTable({
    resource: "companies",
    onSearch: (values) => {
      return [
        {
          field: "name",
          operator: "contains",
          value: values.name,
        },
      ];
    },
    sorters: {
      initial: [
        {
          field: "createdAt",
          order: "desc",
        },
      ],
    },
    filters: {
      initial: [
        {
          field: "name",
          operator: "contains",
          value: undefined,
        },
        {
          field: "contacts.id",
          operator: "in",
          value: undefined,
        },
      ],
    },
    pagination: {
      pageSize: 12,
    },
    meta: {
      gqlQuery: COMPANIES_TABLE_QUERY,
    },
  });

  const onViewChange = (value) => {
    setView(value);
    setFilters([], "replace");
    searchFormProps.form.resetFields();
  };

  const onSearch = (e) => {
    searchFormProps.onFinish({
      name: e.target.value ?? "",
    });
  };
  const debouncedOnChange = debounce(onSearch, 500);

  return (
    <div className="page-container">
      <List
        breadcrumb={false}
        headerButtons={() => (
          <Space
            style={{
              marginTop: screens.xs ? "1.6rem" : undefined,
            }}
          >
            <Form {...searchFormProps} layout="inline">
              <Form.Item name="name" noStyle>
                <Input
                  size="large"
                  prefix={<SearchOutlined className="anticon tertiary" />}
                  suffix={
                    <Spin size="small" spinning={tableQueryResult.isFetching} />
                  }
                  placeholder="Search by name"
                  onChange={debouncedOnChange}
                />
              </Form.Item>
            </Form>
            {!screens.xs ? (
              <Radio.Group
                size="large"
                value={view}
                onChange={(e) => onViewChange(e.target.value)}
              >
                <Radio.Button value="table">
                  <UnorderedListOutlined />
                </Radio.Button>
                <Radio.Button value="card">
                  <AppstoreOutlined />
                </Radio.Button>
              </Radio.Group>
            ) : null}
          </Space>
        )}
        contentProps={{
          style: {
            marginTop: "28px",
          },
        }}
        title={
          <ListTitleButton toPath="companies" buttonText="Add new company" />
        }
      >
        {view === "table" ? (
          <CompaniesTableView
            tableProps={tableProps}
            filters={filters}
            sorters={sorters}
          />
        ) : (
          <CompaniesCardView
            tableProps={tableProps}
            setPageSize={setPageSize}
            setCurrent={setCurrent}
          />
        )}
      </List>
      {children}
    </div>
  );
};
