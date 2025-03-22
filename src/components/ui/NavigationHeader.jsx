import { HiChevronRight, HiHome } from "react-icons/hi2";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";

function NavigationHeader() {
  const { pathname } = useLocation();
  const mainPath = pathname.split("/")[1];
  const secondaryPath = pathname.split("/")?.[2];

  return (
    <div className="text-sm text-slate-500 flex items-center gap-1">
      <HiHome /> <HiChevronRight className="text-xs" />
      <Link to={`/${mainPath}`} type="">
        <span className="text-xs font-medium text-blue-700 capitalize">
          {mainPath}
        </span>
      </Link>
      {secondaryPath && (
        <>
          {" "}
          <HiChevronRight className="text-xs" />
          <span className="text-xs font-medium cursor-pointer text-blue-700 capitalize">
            {secondaryPath}
          </span>{" "}
        </>
      )}
      <Link to="/dashboard/stocks?symbol=SUZLON&ISIN=INE040H01021">
        Navigate to stock
      </Link>
    </div>
  );
}

export default NavigationHeader;
