import { useRef, useEffect } from "react";
import { HiXMark } from "react-icons/hi2";

function Modal({ isOpen, onClose, children }) {
  const modalRef = useRef();

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50/30 bg-opacity-50 px-4">
      <div
        ref={modalRef}
        className="relative mx-auto w-full max-w-xl rounded-lg bg-white"
      >
        <button
          onClick={onClose}
          className="absolute right-2 top-2 text-gray-500 hover:text-gray-700"
        >
          <HiXMark size={24} />
        </button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
