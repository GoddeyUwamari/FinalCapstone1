import { object, string } from "yup";

export const assignSeatValidationSchema = object({
  seat: string().required(),
});
