import * as yup from "yup";

const PASSWORD_VALIDATOR =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;

export const newPasswordValidation = yup.object().shape({
  newPassword: yup
    .string()
    .min(
      8,
      "Password must be 8 to 32 characters containing one lowercase letter, one uppercase letter, one number, and one special character"
    )
    .max(
      32,
      "Password must be 8 to 32 characters containing one lowercase letter, one uppercase letter, one number, and one special character"
    )
    .matches(PASSWORD_VALIDATOR, {
      message:
        "Password must be 8 to 32 characters containing one lowercase letter, one uppercase letter, one number, and one special character"
    })
    .required("Password is required"),
  confirmNewPassword: yup
    .string()
    .oneOf([yup.ref("newPassword")], "Password does not match")
    .required("Enter your new password again")
});
