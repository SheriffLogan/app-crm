import React from "react";

import { AuthPage } from "@refinedev/antd";

import { Title } from "@/components";

export const ForgotPasswordPage = () => {
  return <AuthPage type="forgotPassword" title={<Title collapsed={false} />} />;
};
