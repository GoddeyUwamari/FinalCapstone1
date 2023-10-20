import { number, object, string } from "yup";

export const createTableValidationSchema = object({
  table_name: string()
    .required("Please enter table name")
    .test({
      name: "has_lenght_of_two",
      skipAbsent: true,
      test: (value, ctx) => {
        if (value.length < 2) {
          return ctx.createError({
            message: "Table length must be more than one character",
          });
        }
        return true;
      },
    }),
  capacity: number()
    .required("Please enter a valid capacity")
    .test({
      name: "min_value",
      skipAbsent: true,
      test: (value, ctx) => {
        if (value < 1) {
          return ctx.createError({
            message: "Mininum capaity is 1",
          });
        }

        if (value > 6) {
          return ctx.createError({
            message: "Maximum capacity is 6",
          });
        }
        return true;
      },
    }),
});
