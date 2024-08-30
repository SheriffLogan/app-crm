import dayjs from "dayjs";


export const getDateColor = (args) => {
  const date = dayjs(args.date);
  const today = dayjs();

  if (date.isBefore(today)) {
    return "error";
  }

  if (date.isBefore(today.add(3, "day"))) {
    return "warning";
  }

  return args.defaultColor ?? "default";
};
