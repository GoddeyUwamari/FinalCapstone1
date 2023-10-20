import { capitalize } from "lodash";

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
    value: data.reservation_date,
  },
  {
    label: "Reservation time",
    value: data.reservation_time,
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
