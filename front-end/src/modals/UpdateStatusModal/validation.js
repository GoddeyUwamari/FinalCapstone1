import { object, string } from "yup";

export const updateStatusValidationSchema = object({
  status: string().required(),
});
