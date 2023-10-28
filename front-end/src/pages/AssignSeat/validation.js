import { object, string } from "yup";

export const assignSeatValidationSchema = object({
  table_id: string().required(),
});
