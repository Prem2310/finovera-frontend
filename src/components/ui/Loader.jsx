import { RotatingLines } from "react-loader-spinner";

function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100 bg-opacity-75 z-50">
      <RotatingLines
        visible={true}
        height="42"
        width="42"
        strokeWidth="3"
        strokeColor="#222"
        animationDuration="1"
        ariaLabel="rotating-lines-loading"
      />
    </div>
  );
}

export default Loader;
