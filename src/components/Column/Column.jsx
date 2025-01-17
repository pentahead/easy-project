import React, { useState, useEffect, useRef } from "react";
import { addBoard, updateBoard, deleteBoard } from "../../services/board";
import Card from "../Card/Card";
import CardModal from "../CardModal/CardModal";
import CardDetailModal from "../CardDetailModal/CardDetailModal";
import ToastContainer from "../Toast/ToastContainer";

export default function Column({ selectedBoard, columnData }) {
  const [isEditing, setIsEditing] = useState(false);
  const [columnTitle, setColumnTitle] = useState(columnData.title);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const toastContainerRef = useRef();

  // Handle Edit Column
  const handleEditColumn = async () => {
    if (isEditing) {
      try {
        const result = await updateBoard(columnData.id, {
          ...columnData,
          title: columnTitle,
          updatedAt: new Date().toISOString(),
        });

        if (result.success) {
          toastContainerRef.current?.showToast(
            "Column updated successfully!",
            "success"
          );
          window.dispatchEvent(new CustomEvent("columnUpdated"));
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error("Error updating column:", error);
        toastContainerRef.current?.showToast(
          "Failed to update column!",
          "error"
        );
      }
    }
    setIsEditing(!isEditing);
  };
  

  // Handle Delete Column
  const handleDeleteColumn = async () => {
    if (window.confirm("Are you sure you want to delete this column?")) {
      try {
        const result = await deleteBoard(columnData.id);

        if (result.success) {
          toastContainerRef.current?.showToast(
            "Column deleted successfully!",
            "success"
          );
          window.dispatchEvent(new CustomEvent("columnDeleted"));
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error("Error deleting column:", error);
        toastContainerRef.current?.showToast(
          "Failed to delete column!",
          "error"
        );
      }
    }
  };

  // Handle Add Card
  const handleAddCard = async (cardData) => {
    try {
      const newCard = {
        ...cardData,
        columnId: columnData.id,
        createdAt: new Date().toISOString(),
      };

      const result = awaitaddBoard(newCard);

      if (result.success) {
        setIsModalOpen(false);
        toastContainerRef.current?.showToast(
          "Card added successfully!",
          "success"
        );
        window.dispatchEvent(new CustomEvent("cardAdded"));
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error adding card:", error);
      toastContainerRef.current?.showToast("Failed to add card!", "error");
    }
  };

  // Handle Update Card
  const handleUpdateCard = async (cardId, updatedData) => {
    try {
      const result = await updateBoard(cardId, {
        ...updatedData,
        updatedAt: new Date().toISOString(),
      });

      if (result.success) {
        setIsDetailModalOpen(false);
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
  };

  return (
    <div className="flex-1">
      <div className="bg-slate-50 dark:bg-gray-700 bg-opacity-60 dark:bg-opacity-60 text-gray-700 dark:text-white p-4 shadow-md rounded-lg m-2 flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          {isEditing ? (
            <input
              type="text"
              value={columnTitle}
              onChange={(e) => setColumnTitle(e.target.value)}
              className="font-semibold text-lg bg-transparent border-b border-gray-300 focus:border-blue-500 focus:outline-none"
              autoFocus
            />
          ) : (
            <h3 className="font-semibold text-lg">{columnTitle}</h3>
          )}
          <div className="flex gap-2">
            <button onClick={handleEditColumn} className="text-blue-500">
              {isEditing ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
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
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              )}
            </button>
            <button onClick={handleDeleteColumn} className="text-red-500">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
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

        <div className="flex-1 overflow-y-auto">
          {columnData.cards.map((card) => (
            <Card
              key={card.id}
              card={card}
              onCardClick={() => {
                setSelectedCard(card);
                setIsDetailModalOpen(true);
              }}
            />
          ))}
        </div>

        {/* Add Card Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="mt-4 flex items-center text-blue-500"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
              clipRule="evenodd"
            />
          </svg>
          Add Card
        </button>

        {/* Modals */}
        <CardModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCard(null);
          }}
          onAddCard={handleAddCard}
          selectedCard={selectedCard}
        />

        <CardDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          card={selectedCard}
          onUpdateCard={handleUpdateCard}
        />

        <ToastContainer ref={toastContainerRef} />
      </div>
    </div>
  );
}
