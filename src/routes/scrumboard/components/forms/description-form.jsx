import { lazy, Suspense } from "react";

import { useForm } from "@refinedev/antd";

import { Button, Form, Space } from "antd";

import { KANBAN_UPDATE_TASK_MUTATION } from "../../kanban/queries";

const MDEditor = lazy(() => import("@uiw/react-md-editor"));



export const DescriptionForm = ({ initialValues, cancelForm }) => {
  const { formProps, saveButtonProps } = useForm({
    queryOptions: {
      enabled: false,
    },
    redirect: false,
    onMutationSuccess: () => {
      cancelForm();
    },
    meta: {
      gqlMutation: KANBAN_UPDATE_TASK_MUTATION,
    },
  });

  return (
    <>
      <Form {...formProps} initialValues={initialValues}>
        <Suspense>
          <Form.Item noStyle name="description">
            <MDEditor preview="edit" data-color-mode="light" height={250} />
          </Form.Item>
        </Suspense>
      </Form>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "end",
          marginTop: "12px",
        }}
      >
        <Space>
          <Button type="default" onClick={cancelForm}>
            Cancel
          </Button>
          <Button {...saveButtonProps} type="primary">
            Save
          </Button>
        </Space>
      </div>
    </>
  );
};
