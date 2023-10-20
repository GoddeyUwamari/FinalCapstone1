import { format } from "date-fns";
import { date, number, object, string } from "yup";

export const addResevationForValidationSchema = object({
  first_name: string().required("Please enter your first name"),
  last_name: string().required("Please enter your last name"),
  mobile_number: string().required("Please enter your phone number"),
  reservation_date: date()
    .min(new Date(), "Cannot create reservation for past days")
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
        if (value < "10:30") {
          return ctx.createError({
            message: "Opening hours starts at 10:30 AM",
          });
        }

        if (value > "21:30") {
          return ctx.createError({ message: "Reservation closes by 09:30 PM" });
        }

        return true;
      },
    }),
  people: number().required("Please enter the number people"),
});
