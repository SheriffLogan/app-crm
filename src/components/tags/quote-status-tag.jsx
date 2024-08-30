import React from "react";
import {
  CheckCircleOutlined,
  ExpandOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { Tag } from "antd";

const variant = {
  DRAFT: {
    color: "blue",
    icon: <ExpandOutlined />,
  },
  SENT: {
    color: "cyan",
    icon: <SendOutlined />,
  },
  ACCEPTED: {
    color: "green",
    icon: <CheckCircleOutlined />,
  },
};

const QuoteStatusTag = ({ status }) => {
  return (
    <Tag
      style={{
        textTransform: "capitalize",
      }}
      color={variant[status].color}
      icon={variant[status].icon}
    >
      {status.toLowerCase()}
    </Tag>
  );
};

export default QuoteStatusTag;
