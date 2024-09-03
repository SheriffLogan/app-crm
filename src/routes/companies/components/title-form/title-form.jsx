import { useState } from "react";

import { useForm } from "@refinedev/antd";

import { EditOutlined } from "@ant-design/icons";
import { Button, Form, Select, Skeleton, Space } from "antd";

import { CustomAvatar, SelectOptionWithAvatar, Text } from "@/components";

import { useUsersSelect } from "@/hooks/useUsersSelect";
import { getNameInitials } from "@/utilities";

import { COMPANY_TITLE_FORM_MUTATION, COMPANY_TITLE_QUERY } from "./queries";
import styles from "./title-form.module.css";

export const CompanyTitleForm = () => {
  const {
    formProps,
    query: queryResult,
    onFinish,
  } = useForm({
    redirect: false,
    meta: {
      gqlMutation: COMPANY_TITLE_FORM_MUTATION,
      gqlQuery: COMPANY_TITLE_QUERY,
    },
  });

  const company = queryResult.data ? queryResult.data.data : null;
  const loading = queryResult.isLoading;

  if (loading || !company) {
    return <Skeleton active />;
  }

  return (
    <Form {...formProps}>
      <Space size={16}>
        <CustomAvatar
          size="large"
          shape="square"
          src={company.avatarUrl}
          name={getNameInitials(company.name || "")}
          style={{
            width: 96,
            height: 96,
            fontSize: 48,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "none",
          }}
        />
        <Space direction="vertical" size={0}>
          <Form.Item name="name" required noStyle>
            <TitleInput
              loading={loading}
              value={company.name}
              onChange={(value) => {
                return onFinish({
                  name: value,
                });
              }}
            />
          </Form.Item>
          <SalesOwnerInput
            salesOwner={company.salesOwner}
            loading={loading}
            onChange={(value) => {
              onFinish({
                salesOwnerId: value,
              });
            }}
          />
        </Space>
      </Space>
    </Form>
  );
};

const TitleInput = ({
  value,
  onChange,
  loading,
}) => {
  return (
    <Text
      className={styles.title}
      size="xl"
      strong
      editable={{
        onChange,
        triggerType: ["text", "icon"],
        icon: <EditOutlined className={styles.titleEditIcon} />,
      }}
    >
      {loading ? (
        <Skeleton.Input size="small" style={{ width: 200 }} active />
      ) : (
        value
      )}
    </Text>
  );
};

const SalesOwnerInput = ({
  salesOwner,
  onChange,
  loading,
}) => {
  const [isEdit, setIsEdit] = useState(false);

  const { selectProps, queryResult } = useUsersSelect();

  if (loading) {
    return <Skeleton.Input size="small" style={{ width: 120 }} active />;
  }

  return (
    <div
      className={styles.salesOwnerInput}
      role="button"
      onClick={() => {
        setIsEdit(true);
      }}
    >
      <Text
        type="secondary"
        style={{
          marginRight: 12,
        }}
      >
        Sales Owner:
      </Text>
      {!isEdit && (
        <>
          <CustomAvatar
            size="small"
            src={salesOwner.avatarUrl}
            style={{
              marginRight: 4,
            }}
          />
          <Text>{salesOwner.name}</Text>
          <Button
            type="link"
            icon={<EditOutlined className={styles.salesOwnerInputEditIcon} />}
          />
        </>
      )}
      {isEdit && (
        <Form.Item name={["salesOwner", "id"]} noStyle>
          <Select
            {...selectProps}
            defaultOpen={true}
            autoFocus
            onDropdownVisibleChange={(open) => {
              if (!open) {
                setIsEdit(false);
              }
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
            onChange={(value, option) => {
              onChange(value);
              selectProps.onChange(value, option);
            }}
            options={
              queryResult.data?.data.map(({ id, name, avatarUrl }) => ({
                value: id,
                label: (
                  <SelectOptionWithAvatar
                    name={name}
                    avatarUrl={avatarUrl ?? undefined}
                  />
                ),
              })) ?? []
            }
          />
        </Form.Item>
      )}
    </div>
  );
};
