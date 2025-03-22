import { Avatar } from "@mui/material";

// Avatar generation functions
const getInitials = (name) => {
  const words = name?.split(" ");
  if (words?.length >= 2) {
    return (words[0][0] + words[1][0]).toUpperCase();
  } else {
    return name?.slice(0, 2).toUpperCase();
  }
};

const StockAvatar = ({ name, className }) => {
  return (
    <div
      className={`
        w-12 h-12 
        rounded-lg 
        flex items-center justify-center 
        text-slate-50 text-xl font-semibold 
        shadow-sm
        bg-slate-800
        ${className}
      `}
    >
      {getInitials(name)}
    </div>
  );
};

export default StockAvatar;
