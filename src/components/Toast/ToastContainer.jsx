import React, { useState, useImperativeHandle, forwardRef } from "react";
import Toast from "./Toast";

const ToastContainer = forwardRef((props, ref) => {
  const [toasts, setToasts] = useState([]);

  const MAX_TOASTS = 5;
  
  useImperativeHandle(ref, () => ({
    showToast: (message, type) => {
      setToasts((prevToasts) => {
        const newToasts = [...prevToasts, { message, type }];
        if (newToasts.length > MAX_TOASTS) {
          newToasts.shift();
        }
        return newToasts;
      });
    },
  }));

  return (
    <div className="toast-container">
      {toasts.map((toast, index) => (
        <Toast key={index} {...toast} />
      ))}
    </div>
  );
});

export default ToastContainer;
