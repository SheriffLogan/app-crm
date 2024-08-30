import { Space, Tag, Typography } from "antd";
import dayjs from "dayjs";

import { Text } from "@/components";
import { getDateColor } from "@/utilities";

export const DueDateHeader = ({ dueData }) => {
  if (dueData) {
    const color = getDateColor({
      date: dueData,
      defaultColor: "processing",
    });
    const getTagText = () => {
      switch (color) {
        case "error":
          return "Overdue";
        case "warning":
          return "Due soon";
        default:
          return "Processing";
      }
    };

    return (
      <Space size={[0, 8]}>
        <Tag color={color}>{getTagText()}</Tag>
        <Text>{dayjs(dueData).format("MMMM D, YYYY - h:ma")}</Text>
      </Space>
    );
  }

  return <Typography.Link>Add due date</Typography.Link>;
};
