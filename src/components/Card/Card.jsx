import React, { useState, useRef } from "react";
import { addBoard, updateBoard, deleteBoard } from "../../services/board";

import ToastContainer from "../Toast/ToastContainer";

export default function Card({ card, onCardClick }) {
  const [isEditing, setIsEditing] = useState(false);
  const [cardTitle, setCardTitle] = useState(card.title);
  const toastContainerRef = useRef();

  // Handle Edit Card
  const handleEditCard = async (e) => {
    e.stopPropagation();
    if (isEditing) {
      try {
        const result = await updateBoard(card.id, {
          ...card,
          title: cardTitle,
          updatedAt: new Date().toISOString(),
        });

        if (result.success) {
          toastContainerRef.current?.showToast(
            "Card updated successfully!",
            "success"
          );
          window.dispatchEvent(new CustomEvent("cardUpdated"));
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error("Error updating card:", error);
        toastContainerRef.current?.showToast("Failed to update card!", "error");
      }
    }
    setIsEditing(!isEditing);
  };

  // Handle Delete Card
  const handleDeleteCard = async (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this card?")) {
      try {
        const result = await deleteBoard(card.id);

        if (result.success) {
          toastContainerRef.current?.showToast(
            "Card deleted successfully!",
            "success"
          );
          window.dispatchEvent(new CustomEvent("cardDeleted"));
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error("Error deleting card:", error);
        toastContainerRef.current?.showToast("Failed to delete card!", "error");
      }
    }
  };

  return (
    <div
      onClick={onCardClick}
      className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-md mb-2 cursor-pointer hover:shadow-lg transition-shadow"
    >
      <div className="flex justify-between items-start">
        {isEditing ? (
          <input
            type="text"
            value={cardTitle}
            onChange={(e) => setCardTitle(e.target.value)}
            className="flex-1 text-sm text-gray-700 dark:text-white bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
            autoFocus
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <h4 className="text-sm text-gray-700 dark:text-white">{cardTitle}</h4>
        )}

        <div className="flex gap-2 ml-2">
          <button
            onClick={handleEditCard}
            className="text-blue-500 hover:text-blue-600"
          >
            {isEditing ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            )}
          </button>

          <button
            onClick={handleDeleteCard}
            className="text-red-500 hover:text-red-600"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Card Details Preview */}
      {card.description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
          {card.description}
        </p>
      )}

      <ToastContainer ref={toastContainerRef} />
    </div>
  );
}
