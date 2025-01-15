import React from "react";

export default function Card({ title, description, onClick, onDragStart }) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="bg-white dark:bg-gray-700 shadow-md rounded-lg p-4 m-2 cursor-pointer"
    >
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-300">{description}</p>
    </div>
  );
}
