import { useEffect, useState } from "react";

export const useIsServerSide = () => {
  const [isServerSide, setIsServerSide] = useState(true);

  useEffect(() => {
    setIsServerSide(false);
  }, [setIsServerSide]);

  return isServerSide;
};
