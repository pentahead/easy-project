import React, { useState, useEffect } from "react";

export default function Toast({ message, type }) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`toast ${type} ${isVisible ? "visible" : ""}`}>
      <p>{message}</p>
    </div>
  );
}
