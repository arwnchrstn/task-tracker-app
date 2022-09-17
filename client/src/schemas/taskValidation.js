import * as yup from "yup";

export const taskValidation = yup.object().shape({
  name: yup
    .string()
    .max(120, "Maximum of 120 characters only")
    .required("Task name is required"),
  description: yup.string().max(120, "Maximum of 120 characters only"),
  priority: yup
    .number()
    .min(1, "Invalid input")
    .max(3, "Invalid input")
    .required("Task priority is required"),
  dueDate: yup
    .date()
    .min(
      new Date(new Date() - 60 * 60 * 24 * 1000),
      "Due date cannot be in the past"
    )
    .max(new Date("2099-12-12"), "Due date must not exceed 12/12/2099"),
  time: yup.string().when("dueDate", {
    is: (date) => {
      if (
        date > new Date(new Date() - 60 * 60 * 24 * 1000) ||
        date < new Date("2099-12-12")
      )
        return true;
      else return false;
    },
    then: yup.string().required("Time is required")
  })
});
