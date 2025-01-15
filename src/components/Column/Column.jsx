import React, { useState, useEffect, useRef } from "react";
import Card from "../Card/Card";
import CardModal from "../CardModal/CardModal";
import CardDetailModal from "../CardDetailModal/CardDetailModal";

export default function Column({
  title,
  cards,
  onEditColumn,
  onDeleteColumn,
  onAddCard,
  onMoveCard,
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [newColumnTitle, setNewColumnTitle] = useState(title);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const dropdownRef = useRef(null);

  const handleEditColumn = () => {
    onEditColumn(newColumnTitle);
    setNewColumnTitle(newColumnTitle);
    setIsDropdownOpen(false);
  };

  const handleAddCard = (newCard) => {
    onAddCard(newCard);
    setIsModalOpen(false);
  };

  const handleCardClick = (card) => {
    console.log("Selected Card:", card);
    setSelectedCard(card);
    setIsDetailModalOpen(true);
  };

  const handleUpdateCard = (updatedCard) => {
    setIsDetailModalOpen(false);
  };

  const handleDragStart = (card) => {
    const data = JSON.stringify(card);
    window.localStorage.setItem("draggedCard", data);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const data = window.localStorage.getItem("draggedCard");
    if (data) {
      const draggedCard = JSON.parse(data);
      onMoveCard(draggedCard, title);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  return (
    <div className="flex-1">
      <div
        className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-4 m-2 flex flex-col h-full"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-lg">{newColumnTitle}</h3>
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="text-gray-600 flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                />
              </svg>
            </button>
            {isDropdownOpen && (
              <div className="absolute right-0 bg-white shadow-lg rounded mt-2">
                <div className="p-2">
                  <div className="items-center mb-2">
                    <input
                      type="text"
                      value={newColumnTitle}
                      onChange={(e) => setNewColumnTitle(e.target.value)}
                      className="border rounded p-1 flex-grow"
                      placeholder="New Column Name"
                    />
                  </div>
                  <button
                    onClick={handleEditColumn}
                    className="items-center text-blue-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                      />
                    </svg>
                    Save
                  </button>
                  <button
                    onClick={onDeleteColumn}
                    className="items-center text-red-500 ml-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                      />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 flex-col flex-grow overflow-hidden">
          {cards.map((card) => (
            <Card
              key={card.title}
              title={card.title}
              description={card.description}
              onClick={() => handleCardClick(card)}
              onDragStart={() => handleDragStart(card)}
            />
          ))}
        </div>

        <div className="mt-auto">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center text-blue-500"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15"
              />
            </svg>
            Add Card
          </button>
        </div>

        <CardModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddCard={handleAddCard}
        />
        <CardDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          card={selectedCard}
          onUpdateCard={handleUpdateCard}
        />
      </div>
    </div>
  );
}
