import React from "react";

import { AuthPage } from "@refinedev/antd";

import { Title } from "@/components";

export const UpdatePasswordPage = () => {
  return <AuthPage type="updatePassword" title={<Title collapsed={false} />} />;
};
