
import { Space } from "antd";

import { Text } from "@/components";

import { AccordionHeaderSkeleton } from "../accordion-header-skeleton";


export const AccordionHeader = ({
  icon,
  isActive,
  fallback,
  isLoading = false,
  children,
}) => {
  if (isLoading) {
    return <AccordionHeaderSkeleton />;
  }

  return (
    <Space size={15} align="start">
      {icon}
      {isActive ? <Text strong>{children}</Text> : fallback}
    </Space>
  );
};
