import * as yup from "yup";

export const categoryValidation = yup.object().shape({
  name: yup
    .string()
    .trim()
    .max(50, "Maximum of 50 characters only")
    .required("Category name is required")
});
