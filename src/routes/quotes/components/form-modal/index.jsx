import { useLocation, useParams, useSearchParams } from "react-router-dom";

import { useModalForm } from "@refinedev/antd";
import { useNavigation } from "@refinedev/core";

import { PlusCircleOutlined } from "@ant-design/icons";
import { Button, Form, Input, Modal, Select, Spin } from "antd";

import { useCompaniesSelect } from "@/hooks/useCompaniesSelect";
import { useContactsSelect } from "@/hooks/useContactsSelect";
import { useUsersSelect } from "@/hooks/useUsersSelect";

import {
  QUOTES_CREATE_QUOTE_MUTATION,
  QUOTES_UPDATE_QUOTE_MUTATION,
} from "../../queries";

export const QuotesFormModal = ({
  action,
  redirect,
  onCancel,
  onMutationSuccess,
}) => {
  const { pathname } = useLocation();
  const params = useParams();
  const { list, replace } = useNavigation();
  const [searchParams] = useSearchParams();

  const { formProps, modalProps, close } = useModalForm({
    resource: "quotes",
    action,
    id: params.id,
    defaultVisible: true,
    redirect,
    meta: {
      gqlMutation:
        action === "create"
          ? QUOTES_CREATE_QUOTE_MUTATION
          : QUOTES_UPDATE_QUOTE_MUTATION,
    },
    onMutationSuccess: () => {
      onMutationSuccess();
    },
  });

  const {
    selectProps: selectPropsCompanies,
    queryResult: { isLoading: isLoadingCompanies },
  } = useCompaniesSelect();

  const {
    selectProps: selectPropsContacts,
    queryResult: { isLoading: isLoadingContact },
  } = useContactsSelect();

  const {
    selectProps: selectPropsSalesOwners,
    queryResult: { isLoading: isLoadingSalesOwners },
  } = useUsersSelect();

  const loading =
    isLoadingCompanies || isLoadingContact || isLoadingSalesOwners;

  const isHaveOverModal = pathname.includes("company-create");

  const initialValues = formProps?.initialValues || {};

  return (
    <Modal
      {...modalProps}
      confirmLoading={loading}
      width={560}
      style={{ display: isHaveOverModal ? "none" : "inherit" }}
      onCancel={() => {
        if (onCancel) {
          onCancel();
          return;
        }
        close();
        list("quotes", "replace");
      }}
    >
      <Spin spinning={loading}>
        <Form {...formProps} layout="vertical">
          <Form.Item
            rules={[{ required: true }]}
            name="title"
            label="Quotes title"
          >
            <Input placeholder="Please enter quote title" />
          </Form.Item>
          <Form.Item
            rules={[{ required: true }]}
            name="salesOwnerId"
            initialValue={initialValues.salesOwner?.id}
            label="Sales owner"
          >
            <Select
              {...selectPropsSalesOwners}
              placeholder="Please select user"
            />
          </Form.Item>
          <Form.Item
            rules={[{ required: true }]}
            name="companyId"
            initialValue={
              searchParams.get("companyId") ?? initialValues.company?.id
            }
            label="Company"
            extra={
              <Button
                style={{ paddingLeft: 0 }}
                type="link"
                icon={<PlusCircleOutlined />}
                onClick={() => replace(`company-create?to=${pathname}`)}
              >
                Add new company
              </Button>
            }
          >
            <Select
              {...selectPropsCompanies}
              placeholder="Please select company"
            />
          </Form.Item>
          <Form.Item
            rules={[{ required: true }]}
            name="contactId"
            initialValue={initialValues.contact?.id}
            label="Quote Contact"
          >
            <Select
              {...selectPropsContacts}
              placeholder="Please select contact"
            />
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  );
};
