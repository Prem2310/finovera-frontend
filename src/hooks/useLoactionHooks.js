//Hook to get the current location of the page.
import { useLocation } from "react-router-dom";

const useLocationHook = () => {
  const location = useLocation();

  const getPathSegments = () => {
    // Remove leading slash and split the pathname
    const segments = location.pathname.slice(1).split("/");
    // Filter out empty segments
    return segments.filter((segment) => segment !== "");
  };

  return {
    ...location,
    getPathSegments,
  };
};

export default useLocationHook;
