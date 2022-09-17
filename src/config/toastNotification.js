import { toast } from "react-toastify";

/**
 *
 * @param {String} errorMessage  - Error message to be displayed
 */
export const errorToast = (errorMessage) => {
  toast.error(errorMessage, {
    position: "top-right",
    autoClose: 3500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
  });
};

/**
 *
 * @param {String} successMessage  - Error message to be displayed
 */
export const successToast = (successMessage) => {
  toast.success(successMessage, {
    position: "top-right",
    autoClose: 3500,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined
  });
};
