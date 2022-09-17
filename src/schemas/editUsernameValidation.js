import * as yup from "yup";

const USERNAME_VALIDATOR = /^[a-z0-9]([._-](?![._-])|[a-z0-9]){3,18}[a-z0-9]$/;

export const editUsernameValidation = yup.object().shape({
  username: yup
    .string()
    .trim()
    .min(5, "Username must be at least 5 characters")
    .max(20, "Username must be maximum of 20 characters only")
    .matches(
      USERNAME_VALIDATOR,
      "Username must only contain lowercase letters, numbers, and underscore. No underscore at the beginning and ending of the username."
    )
    .required("Username is required")
});
