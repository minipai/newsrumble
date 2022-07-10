import { format, parseISO } from "date-fns";

export function formatDate(date: string) {
  if (!date) return "日期待查";
  return format(parseISO(date), "yyyy年MM月dd日");
}
