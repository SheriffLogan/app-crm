import { memo } from "react";

import { Avatar as AntdAvatar } from "antd";

import { getNameInitials, getRandomColorFromString } from "@/utilities";


const CustomAvatarComponent = ({ name = "", style, ...rest }) => {
  return (
    <AntdAvatar
      alt={name}
      size="small"
      style={{
        backgroundColor: rest.src
          ? "transparent"
          : getRandomColorFromString(name),
        display: "flex",
        alignItems: "center",
        border: "none",
        ...style,
      }}
      {...rest}
    >
      {getNameInitials(name)}
    </AntdAvatar>
  );
};

export const CustomAvatar = memo(
  CustomAvatarComponent,
  (prevProps, nextProps) => {
    return prevProps.name === nextProps.name && prevProps.src === nextProps.src;
  },
);
