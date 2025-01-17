import React, { useState, forwardRef, useImperativeHandle } from "react";

const ToastContainer = forwardRef((props, ref) => {
  const [toasts, setToasts] = useState([]);

  useImperativeHandle(ref, () => ({
    showToast: (message, type = "success") => {
      const newToast = {
        id: Date.now(),
        message,
        type,
      };
      setToasts((prevToasts) => [...prevToasts, newToast]);
      setTimeout(() => {
        setToasts((prevToasts) =>
          prevToasts.filter((toast) => toast.id !== newToast.id)
        );
      }, 3000);
    },
  }));

  return (
    <div className="fixed bottom-4 right-4 z-50 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`mb-2 p-4 rounded-lg shadow-lg text-white ${
            toast.type === "success"
              ? "bg-green-500"
              : toast.type === "error"
                ? "bg-red-500"
                : "bg-blue-500"
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
});

ToastContainer.displayName = "ToastContainer";

export default ToastContainer;
