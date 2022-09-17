import { useDispatch } from "react-redux";

import { setUser } from "../redux/features/userSlice";

const useSetUser = () => {
  const dispatch = useDispatch();

  return (username, email, isVerified, dateCreated) => {
    dispatch(setUser({ username, email, isVerified, dateCreated }));
  };
};

export default useSetUser;
