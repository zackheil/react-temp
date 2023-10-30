import { useLocation } from 'react-router-dom';

export const useInRouter = (): boolean => {
  let inRouter = false;
  try {
    inRouter = !!useLocation()
  } catch (e) { }
  return inRouter;
};
