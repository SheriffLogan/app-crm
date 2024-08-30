

export const PaginationTotal = ({
  total,
  entityName,
}) => {
  return (
    <span
      style={{
        marginLeft: "16px",
      }}
    >
      <span className="ant-text secondary">{total}</span> {entityName} in total
    </span>
  );
};
