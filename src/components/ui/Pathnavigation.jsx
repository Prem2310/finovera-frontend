import React from "react";
import { HiOutlineChevronRight } from "react-icons/hi2";
import { HiHome } from "react-icons/hi";
import { Link } from "react-router-dom";
import useLocationHook from "../../hooks/useLoactionHooks";

function PathNavigation() {
  const location = useLocationHook();
  const pathSegments = location.getPathSegments();

  return (
    <div className="mb-4 flex items-center gap-1 text-xs">
      <Link to="/dashboard" className="flex items-center">
        <HiHome className="text-gray-600" />
      </Link>
      {pathSegments.map((segment, index) => (
        <React.Fragment key={index}>
          <HiOutlineChevronRight className="text-gray-600" />
          <Link
            to={`/${pathSegments.slice(0, index + 1).join("/")}`}
            className="flex items-center"
          >
            <span className="text-xs font-medium capitalize text-ocean-800">
              {segment.replace(/-/g, " ")}
            </span>
          </Link>
        </React.Fragment>
      ))}
    </div>
  );
}

export default PathNavigation;
