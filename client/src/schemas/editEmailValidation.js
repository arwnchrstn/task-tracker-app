import * as yup from "yup";

export const editEmailValidation = yup.object().shape({
  email: yup
    .string()
    .trim()
    .email("Enter a valid email")
    .max(256, "Maximum of 256 characters only")
    .required("Email is required")
});
