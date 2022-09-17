import * as yup from "yup";

export const resetPasswordValidation = yup.object().shape({
  emailUsername: yup
    .string()
    .trim()
    .max(256, "Maximum of 256 characters only")
    .required("Email or username is required for password reset")
});
