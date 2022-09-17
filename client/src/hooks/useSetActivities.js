import { useDispatch } from "react-redux";

import { setActivities } from "../redux/features/recentActivitySlice";

const useSetActivities = () => {
  const dispatch = useDispatch();

  return (activities) => {
    dispatch(setActivities({ activities }));
  };
};

export default useSetActivities;
