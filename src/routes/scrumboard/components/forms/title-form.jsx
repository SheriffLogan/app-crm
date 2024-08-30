import { useEffect } from "react";

import { useForm } from "@refinedev/antd";
import {  useInvalidate } from "@refinedev/core";

import { Form, Skeleton } from "antd";

import { Text } from "@/components";

import { KANBAN_UPDATE_TASK_MUTATION } from "../../kanban/queries";

const TitleInput = ({
  value,
  onChange,
}) => {
  const onTitleChange = (newTitle) => {
    onChange(newTitle);
  };

  return (
    <Text
      editable={{
        onChange: onTitleChange,
      }}
      style={{ width: "98%" }}
    >
      {value}
    </Text>
  );
};


export const TitleForm = ({ initialValues, isLoading }) => {
  const invalidate = useInvalidate();

  const { formProps } = useForm({
    queryOptions: {
      enabled: false,
    },
    redirect: false,
    warnWhenUnsavedChanges: false,
    autoSave: {
      enabled: true,
    },
    onMutationSuccess: () => {
      invalidate({ invalidates: ["list"], resource: "tasks" });
    },
    meta: {
      gqlMutation: KANBAN_UPDATE_TASK_MUTATION,
    },
  });

  useEffect(() => {
    formProps.form.setFieldsValue(initialValues);
  }, [initialValues.title]);

  if (isLoading) {
    return (
      <Skeleton.Input
        size="small"
        style={{ width: "95%", height: "22px" }}
        block
      />
    );
  }

  return (
    <Form {...formProps} initialValues={initialValues}>
      <Form.Item noStyle name="title">
        <TitleInput />
      </Form.Item>
    </Form>
  );
};
