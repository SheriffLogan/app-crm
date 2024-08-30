import { MarkdownField } from "@refinedev/antd";

import { Typography } from "antd";



export const DescriptionHeader = ({ description }) => {
  if (description) {
    return (
      <Typography.Paragraph ellipsis={{ rows: 8 }}>
        <MarkdownField value={description} />
      </Typography.Paragraph>
    );
  }

  return <Typography.Link>Add task description</Typography.Link>;
};
