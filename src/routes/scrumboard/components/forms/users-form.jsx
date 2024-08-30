import { useForm } from "@refinedev/antd";

import { Button, Form, Select, Space } from "antd";

import { useUsersSelect } from "@/hooks/useUsersSelect";

import { KANBAN_UPDATE_TASK_MUTATION } from "../../kanban/queries";

export const UsersForm = ({ initialValues, cancelForm }) => {
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

  const { selectProps } = useUsersSelect();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "end",
        justifyContent: "space-between",
        gap: "12px",
      }}
    >
      <Form
        {...formProps}
        style={{ width: "100%" }}
        initialValues={initialValues}
      >
        <Form.Item noStyle name="userIds">
          <Select
            {...selectProps}
            className="kanban-users-form-select"
            dropdownStyle={{ padding: "0px" }}
            style={{ width: "100%" }}
            mode="multiple"
          />
        </Form.Item>
      </Form>
      <Space>
        <Button type="default" onClick={cancelForm}>
          Cancel
        </Button>
        <Button {...saveButtonProps} type="primary">
          Save
        </Button>
      </Space>
    </div>
  );
};
