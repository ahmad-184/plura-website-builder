import { format, getTime } from "date-fns";

export default function packDataByDate(data: any[]) {
  const packedData: any = {};

  data.forEach((d) => {
    const date = format(new Date(getTime(d.createdAt)), "MM/dd/yyyy");

    if (!packedData[date]) {
      packedData[date] = [];
    }

    packedData[date].push(d);
  });

  return packedData;
}
