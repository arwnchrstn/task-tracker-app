import { useState, useEffect, useRef } from "react";

import axios from "axios";

import useResetAllState from "./useResetAllState";
import useSetActivities from "./useSetActivities";
import useSetUser from "./useSetUser";
import { errorToast } from "../config/toastNotification";

const useLoadUser = () => {
  const [isUserLoading, setIsUserLoading] = useState(true);
  const isUserLoggedIn = useRef();

  const resetAllState = useResetAllState();
  const setActivities = useSetActivities();
  const setUser = useSetUser();

  //check if user is logged in on page load
  isUserLoggedIn.current = async () => {
    try {
      setIsUserLoading(true);
      const response = await axios.get(
        process.env.REACT_APP_API_SERVER + "/api/users/check_user"
      );

      if (response.status === 200) {
        if (response.data === "please login") return resetAllState();
        //set user
        setUser(
          response.data.username,
          response.data.email,
          response.data.isVerified,
          response.data.dateCreated
        );
        setActivities(response.data.activities);
      }
    } catch (error) {
      if (error.response.status === 403) {
        resetAllState();
        errorToast(error.response.data);
        return;
      }
      console.error(`${error.response.status} / ${error.response.data}`);
      //remove user state
      resetAllState();
    } finally {
      setIsUserLoading(false);
    }
  };

  useEffect(() => {
    isUserLoggedIn.current();
  }, []);

  return isUserLoading;
};

export default useLoadUser;
