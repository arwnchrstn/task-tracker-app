import * as yup from "yup";

const USERNAME_VALIDATOR = /^[a-z0-9]([._-](?![._-])|[a-z0-9]){3,18}[a-z0-9]$/;
const PASSWORD_VALIDATOR =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;

export const signupValidation = yup.object().shape({
  username: yup
    .string()
    .trim()
    .min(5, "Username must be at least 5 characters")
    .max(20, "Username must be maximum of 20 characters only")
    .matches(
      USERNAME_VALIDATOR,
      "Username must only contain lowercase letters, numbers, and underscore. No underscore at the beginning and ending of the username."
    )
    .required("Username is required"),
  email: yup
    .string()
    .trim()
    .email("Enter a valid email")
    .max(256, "Maximum of 256 characters only")
    .required("Email is required"),
  password: yup
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
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Password does not match")
    .required("Enter your password again")
});
