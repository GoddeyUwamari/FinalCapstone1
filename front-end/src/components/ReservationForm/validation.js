import { format } from "date-fns";
import { date, number, object, string } from "yup";
import { today } from "../../utils/date-time";
import { getHourAndMinFromTime } from "../../utils/generics";

export const reservationFormValidationSchema = object({
  first_name: string().required("Please enter your first name"),
  last_name: string().required("Please enter your last name"),
  mobile_number: string().required("Please enter your phone number"),
  reservation_date: date()
    .min(today(), "Cannot create reservation for past days")
    .test({
      name: "is-Tuesday",
      skipAbsent: true,
      test: (value, ctx) => {
        if (format(new Date(value), "eee") === "Tue") {
          return ctx.createError({
            message: "Reservations are closed on Tuesday",
          });
        }
        return true;
      },
    })
    .required("Please enter a valid date"),
  reservation_time: string()
    .required("Please enter a valid time")
    .test({
      name: "is-Open",
      skipAbsent: true,
      test: (value, ctx) => {
        const openingTime = new Date().setHours(10, 30);
        const closingTime = new Date().setHours(21, 30);
        const timeObj = getHourAndMinFromTime(value);
        const time = new Date().setHours(timeObj.hour, timeObj.min);

        if (time < openingTime) {
          return ctx.createError({
            message: "Opening hours starts at 10:30 AM",
          });
        }

        if (time > closingTime) {
          return ctx.createError({ message: "Reservation closes by 09:30 PM" });
        }

        return true;
      },
    }),
  people: number()
    .min(1, "Mininum of 1 person")
    .max(6, "Maximum of 6 people")
    .required("Please enter the number people"),
});
