import { useDispatch } from "react-redux";

import { removeTasks } from "../redux/features/taskSlice";
import { removeUser } from "../redux/features/userSlice";
import { removeActivities } from "../redux/features/recentActivitySlice";

const useResetAllState = () => {
  const dispatch = useDispatch();

  return () => {
    dispatch(removeUser());
    dispatch(removeTasks());
    dispatch(removeActivities());
  };
};

export default useResetAllState;
