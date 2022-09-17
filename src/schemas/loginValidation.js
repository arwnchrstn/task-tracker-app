import * as yup from "yup";

export const loginValidation = yup.object().shape({
  emailUsername: yup.string().required("Please type your email or username"),
  password: yup.string().required("Please enter your password")
});
