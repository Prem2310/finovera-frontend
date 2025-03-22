function OrderTypeChip({ type }) {
  type = type.toUpperCase();
  const baseStyle =
    "text-sm flex w-fit rounded-md uppercase px-2 py-[0.5px] justify-center items-center";
  const style = {
    SELL: "text-red-600 bg-red-50 border border-red-200",
    BUY: "text-green-600 bg-green-50 border border-green-200",
  };
  return (
    <span className={`${style[type]} ${baseStyle}`}>
      {!type ? "Sell" : "Buy"}
    </span>
  );
}

export default OrderTypeChip;
