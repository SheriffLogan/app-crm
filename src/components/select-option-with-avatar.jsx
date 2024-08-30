
import { Space } from "antd";

import { CustomAvatar } from "./custom-avatar";
import { Text } from "./text";


export const SelectOptionWithAvatar= ({
  avatarUrl,
  name,
  shape,
}) => {
  return (
    <Space>
      <CustomAvatar shape={shape} name={name} src={avatarUrl} />
      <Text>{name}</Text>
    </Space>
  );
};
