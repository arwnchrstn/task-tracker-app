import { useDispatch } from "react-redux";

import { setTasks } from "../redux/features/taskSlice";

const useSetTasks = () => {
  const dispatch = useDispatch();

  return (categories, totalCount) => {
    dispatch(setTasks({ categories, totalCount }));
  };
};

export default useSetTasks;
