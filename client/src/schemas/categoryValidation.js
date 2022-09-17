import * as yup from "yup";

export const categoryValidation = yup.object().shape({
  name: yup
    .string()
    .trim()
    .min(5, "Category name must be at least 5 characters")
    .max(50, "Maximum of 50 characters only")
    .required("Category name is required")
});
