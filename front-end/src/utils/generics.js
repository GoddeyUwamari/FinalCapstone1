import { capitalize } from "lodash";
import { formatAsDate, formatAsTime } from "./date-time";

export const getSearchedResult = (data) => [
  {
    label: "Name",
    value: `${data.first_name} ${data.last_name}`,
  },
  {
    label: "Phone",
    value: data.mobile_number,
  },
  {
    label: "Reservation date",
    value: formatAsDate(data.reservation_date),
  },
  {
    label: "Reservation time",
    value: formatAsTime(data.reservation_time),
  },
  {
    label: "Status",
    value: capitalize(data.status),
  },
  {
    label: "Capacity",
    value: data.people,
  },
];
