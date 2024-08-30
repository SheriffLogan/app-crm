import React from "react";
import { useModal } from "@refinedev/antd";
import { useList } from "@refinedev/core";
import { FlagOutlined, SettingOutlined } from "@ant-design/icons";
import { Button, Card, Checkbox, Skeleton, theme } from "antd";
import { Text } from "@/components";
import { EVENT_CATEGORIES_QUERY } from "@/graphql/queries";
import styles from "./index.module.css";
import { CalendarManageCategories } from "./manage-categories";

export const CalendarCategories = ({ onChange, ...rest }) => {
  const { token } = theme.useToken();
  const { modalProps, show, close } = useModal();
  const { data, isLoading } = useList({
    resource: "eventCategories",
    meta: {
      gqlQuery: EVENT_CATEGORIES_QUERY,
    },
  });

  const categories = data?.data || [];

  return (
    <>
      <Card
        title={
          <span>
            <FlagOutlined style={{ color: token.colorPrimary }} />
            <Text size="sm" style={{ marginLeft: ".5rem" }}>
              Categories
            </Text>
          </span>
        }
        extra={
          <Button
            shape="circle"
            onClick={() => show()}
            icon={<SettingOutlined />}
          />
        }
        bodyStyle={{
          padding: "0.5rem 1rem",
        }}
        {...rest}
      >
        <div className={styles.container}>
          {isLoading ? (
            <Skeleton
              loading={isLoading}
              active
              paragraph={{
                rows: 3,
                width: 200,
              }}
            />
          ) : (
            categories.map((item) => (
              <div key={item.id} className={styles.category}>
                <Checkbox
                  className={styles.checkbox}
                  value={item.id}
                  onChange={onChange}
                >
                  <Text>{item.title}</Text>
                </Checkbox>
              </div>
            ))
          )}
        </div>
      </Card>

      <CalendarManageCategories {...modalProps} saveSuccces={() => close()} />
    </>
  );
};
