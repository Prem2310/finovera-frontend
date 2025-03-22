function Button({
  children,
  type,
  onClick,
  icon,
  shadow,
  className,
  btnType = "button",
  disabled,
}) {
  const baseStyle =
    "rounded-md md:py-2 md:px-3 text-xs p-2 transition-all ease-in md:text-sm w-fit h-fit inline-flex items-center justify-center gap-2 font-medium";

  const styles = {
    primary: "bg-slate-800 hover:bg-slate-900 text-white",
    outline: "border border-slate-700 text-slate-900 hover:bg-slate-50",
    soft: "bg-slate-50/90 text-slate-700 hover:bg-slate-100/50",
    dark: "bg-midnight-700 hover:bg-midnight-900",
    danger: "bg-red-700 hover:bg-red-800 text-white",
    success: "bg-green-600 hover:bg-green-700 text-white",
    "sell-btn":
      "border-[1.5px] border-red-700 bg-red-50 hover:bg-red-100/60 text-red-700 uppercase",
    "buy-btn": "bg-ocean-700 hover:bg-ocean-800 text-white uppercase",
    "green-soft": "bg-green-100 text-green-800 hover:bg-green-200",
    "green-outline": "border border-green-600 text-green-700 hover:bg-green-50",
    tertiary: "bg-white hover:bg-slate-100 border border-slate-700",
    underline:
      "text-midnight-400 hover:text-midnight-600 hover:underline hover:underline-offset-2 transition-all ease-in",
    disabled: "bg-gray-500 cursor-not-allowed text-white",
  };

  return (
    <button
      onClick={onClick}
      type={btnType}
      className={`${baseStyle} ${styles[type]} ${shadow ? "shadow-sm" : ""} ${
        className || ""
      } ${disabled && "bg-gray-300"}`}
    >
      {icon}
      {children}
    </button>
  );
}

export default Button;
