import {
  Outlet,
  useLocation,
  Link,
  Navigate,
  useNavigate,
} from "react-router-dom";
import Logo from "../assets/finovera.png";
import React from "react";
import {
  HiOutlineArrowsRightLeft,
  HiOutlineBriefcase,
  HiOutlineChartBar,
  HiOutlineChatBubbleLeftRight,
  HiOutlineCog6Tooth,
  HiOutlineLifebuoy,
  HiOutlinePresentationChartLine,
  HiOutlineReceiptPercent,
  HiOutlineRectangleGroup,
  HiOutlineRectangleStack,
  HiOutlineUsers,
} from "react-icons/hi2";
import PathNavigation from "../components/ui/Pathnavigation";
// import { SignedIn, UserButton} from "@clerk/clerk-react";

function AppLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  // const { isSignedIn } = useUser();
  // const session = useSession();

  // if (!isSignedIn) {
  //   navigate("/signin");
  // }

  const navItems = [
    { path: "/dashboard", icon: HiOutlineRectangleGroup, label: "Dashboard" },
    { path: "/portfolios", icon: HiOutlineBriefcase, label: "Portfolios" },
    { path: "/watchlist", icon: HiOutlineRectangleStack, label: "Watchlist" },
    { path: "/taxes", icon: HiOutlineReceiptPercent, label: "Tax" },
    {
      path: "/transactions",
      icon: HiOutlineArrowsRightLeft,
      label: "Transaction History",
    },
    { path: "/chat", icon: HiOutlineChatBubbleLeftRight, label: "Finbot" },
  ];

  return (
    <div>
      <div className="grid grid-cols-[4.5rem_1fr] h-[100vh]">
        <div className="border-gray-200 border-r flex py-4 items-center justify-between flex-col">
          <div className="w-10 ">
            <img src={Logo} alt="finovera logo" />
          </div>
          <div className="flex flex-col gap-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`p-2 rounded-md relative group ${
                  pathname === item.path ? "bg-slate-100" : ""
                }`}
              >
                <item.icon
                  className={`text-2xl hover:text-slate-800 transition-all ease-linear text-slate-600 ${
                    pathname === item.path ? "text-slate-800" : ""
                  }`}
                />
                <span className="absolute top-1 left-12 ml-0 bg-white shadow shadow-gray-200  text-slate-800 px-2 py-1 rounded-md text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
          <div onClick={() => navigate("/settings")}>
            {/* <UserButton /> */}
            <div>
              <span className="p-2 rounded-full bg-slate-900 w-12 h-12 ">AC</span>
            </div>
          </div>
        </div>
        <div className="bg-slate-50 overflow-auto p-4">
          <PathNavigation />
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
