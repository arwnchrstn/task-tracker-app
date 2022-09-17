import * as yup from "yup";

export const deleteAccountValidation = yup.object().shape({
  confirmPassword: yup.string().required("Please enter your password"),
  confirmation: yup
    .string()
    .oneOf(
      ["/delete my account"],
      'Please type "delete my account" to continue'
    )
    .required('Please type "/delete my account" to continue')
});
