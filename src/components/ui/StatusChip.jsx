function StatusChip({ status, type, children }) {
  const position = {
    holding: " rounded-md border  border-blue-600 text-blue-600 ",
  };
  return (
    <span
      className={`inline-flex text-sm font-medium uppercase size-fit px-2 py-1 ${position[type]}`}
    >
      Holding
    </span>
  );
}

export default StatusChip;
