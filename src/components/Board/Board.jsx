import React, { useState, useEffect, useRef } from "react";
import { addBoard, updateBoard, deleteBoard } from "../../services/board";
import ToastContainer from "../Toast/ToastContainer";
import Column from "../Column/Column";

export default function Board({ selectedBoard, onBoardUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [boardTitle, setBoardTitle] = useState("");
  const [columns, setColumns] = useState(selectedBoard?.columns || []);
  const toastContainerRef = useRef();

  useEffect(() => {
    if (selectedBoard && !isEditing) {
      setBoardTitle(selectedBoard.title);
    }
  }, [selectedBoard, isEditing]);

  const handleEditClick = async () => {
    if (isEditing) {
      try {
        const updatedBoard = {
          ...selectedBoard,
          title: boardTitle,
          updatedAt: new Date().toISOString(),
        };
  
        const result = await updateBoard(selectedBoard.id, updatedBoard);
  
        if (result.success) {
          onBoardUpdate(updatedBoard);
          toastContainerRef.current?.showToast("Board updated successfully!", "success");
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error("Error updating board:", error);
        toastContainerRef.current?.showToast("Failed to update board!", "error");
        setBoardTitle(selectedBoard.title);
      }
    }
    setIsEditing(!isEditing);
  };

  // Handle Delete Board
  const handleDeleteClick = async (boardId) => {
    if (window.confirm("Are you sure you want to delete this board?")) {
      try {
        const result = await deleteBoard(selectedBoard.id);

        if (result.success) {
          toastContainerRef.current?.showToast(
            "Board deleted successfully!",
            "success"
          );
          window.dispatchEvent(new CustomEvent("boardDeleted", { detail: { boardId } }));
        } else {
          throw new Error(result.error);
        }
      } catch (error) {
        console.error("Error deleting board:", error);
        toastContainerRef.current?.showToast(
          "Failed to delete board!",
          "error"
        );
      }
    }
  };

  // Handle Add Column
  const handleAddColumn = async () => {
    try {
      const newColumn = {
        boardId: selectedBoard.id,
        title: "New Column",
        cards: [],
      };

      const result = await addBoard(newColumn);

      if (result.success) {
        toastContainerRef.current?.showToast(
          "Column added successfully!",
          "success"
        );
        window.dispatchEvent(new CustomEvent("columnAdded"));
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error adding column:", error);
      toastContainerRef.current?.showToast("Failed to add column!", "error");
    }
  };

  return (
    <div className="shadow-2xl shadow-slate-900 text-white bg-clip-padding backdrop-filter bg-white dark:bg-black bg-opacity-10 backdrop-blur-lg dark:bg-opacity-60 dark:shadow-black p-4 flex flex-col transition-transform duration-300 m-2 rounded-md flex-grow h-full">
      <div className="flex justify-between items-center">
        <div className="flex gap-2 items-center mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-proportions text-gray-800 dark:text-white"
          >
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="M12 9v11" />
            <path d="M2 9h13a2 2 0 0 1 2 2v9" />
          </svg>
          {isEditing ? (
            <input
              type="text"
              value={boardTitle}
              onChange={(e) => setBoardTitle(e.target.value)}
              className="font-bold text-gray-700 dark:text-white text-xl bg-white bg-opacity-10 hover:bg-opacity-20 transition duration-500 shadow-inner shadow-slate-600/90 rounded-md p-2 outline-none"
              autoFocus
            />
          ) : (
            <h2 className="font-bold text-gray-700 dark:text-white text-xl">
              {boardTitle}
            </h2>
          )}
        </div>
        <div>
          <button onClick={handleEditClick} className="text-blue-500 mr-2">
            {isEditing ? (
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
                  d="m4.5 12.75 6 6 9-13.5"
                />
              </svg>
            ) : (
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
            )}
          </button>
          <button onClick={handleDeleteClick} className="text-red-500">
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
          </button>
        </div>
      </div>

      <hr className="h-px my-2 bg-black border-0" />

      <div className="flex justify-between items-start h-full">
        <div className="flex h-full w-full">
          {columns.map((column) => (
            <Column
              key={column.id}
              columnData={column}
              selectedBoard={selectedBoard}
            />
          ))}
        </div>
        <button
          onClick={handleAddColumn}
          className="py-1 px-2 text-white bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-70 bg-green-500 hover:bg-opacity-30 rounded-lg shadow-lg transition-colors duration-300 rounded ml-auto"
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
        </button>
      </div>
      <ToastContainer ref={toastContainerRef} />
    </div>
  );
}
