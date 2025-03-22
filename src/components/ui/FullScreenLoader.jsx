import React from "react";
import { LineWave } from "react-loader-spinner";

const FullScreenLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-slate-100/50 z-50">
      <LineWave
        height="100"
        width="100"
        firstLineColor="#22C55E"
        middleLineColor="#EF4444"
        lastLineColor="#22C55E"
      />
    </div>
  );
};

export default FullScreenLoader;
