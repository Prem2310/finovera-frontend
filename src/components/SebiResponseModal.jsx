import React from "react";
import Modal from "./Modal";
function SebiResponseModal({ data, isOpen, onClose }) {
  console.log(data);
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="text-slate-600 tracking-tight leading-1.5 p-6">
        <p>{data}</p>
      </div>
    </Modal>
  );
}

export default SebiResponseModal;
