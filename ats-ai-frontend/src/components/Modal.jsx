import React from "react";

const Modal = ({ open, onClose, title, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-sm rounded-2xl bg-[rgba(15,23,42,0.96)] p-5 border border-slate-600">
        <h2 className="text-sm font-semibold mb-2">{title}</h2>
        <div className="text-xs text-slate-200 mb-4">{children}</div>
        <button
          onClick={onClose}
          className="w-full rounded-md border border-slate-500/60 py-1.5 text-xs text-slate-200 hover:border-cyan-300 hover:text-cyan-300"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Modal;
