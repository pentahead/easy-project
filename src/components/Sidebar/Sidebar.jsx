import React, { useState, useRef, useEffect } from "react";
import {
  addBoard,
  updateBoard,
  deleteBoard,
  getAllBoards,
} from "../../services/board";
import { v4 as uuidv4 } from "uuid";
import ToastContainer from "../Toast/ToastContainer";

export default function Sidebar({ boards, onSelectBoard }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [currentpageIndex, setCurrentpageIndex] = useState(0);
  const [boardsPerPage, setBoardsPerPage] = useState(10);
  const toastContainerRef = useRef();

  const handleAddBoard = async () => {
    if (!newBoardTitle.trim()) {
      toastContainerRef.current?.showToast(
        "Board title cannot be empty!",
        "error"
      );
      return;
    }

    try {
      const newBoard = {
        id: uuidv4(),
        title: newBoardTitle,
        columns: [
          { id: uuidv4(), title: "Backlog", cards: [] },
          { id: uuidv4(), title: "On Progress", cards: [] },
          { id: uuidv4(), title: "Done", cards: [] },
        ],
      };

      const result = await addBoard(newBoard);

      if (result.success) {
        toastContainerRef.current?.showToast(
          "Board created successfully!",
          "success"
        );
        window.dispatchEvent(new CustomEvent("boardAdded"));
        setNewBoardTitle("");
        setIsDropdownOpen(false);
        onSelectBoard(newBoard); 
        localStorage.setItem("selectedBoardId", newBoard.id);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error creating board:", error);
      toastContainerRef.current?.showToast("Failed to create board!", "error");
    }
  };

  const updateBoardsPerPage = () => {
    const screenWidth = window.innerWidth;
    if (screenWidth >= 1200) setBoardsPerPage(9);
    else if (screenWidth >= 992) setBoardsPerPage(8);
    else if (screenWidth >= 768) setBoardsPerPage(6);
    else setBoardsPerPage(4);
  };

  useEffect(() => {
    updateBoardsPerPage();
    window.addEventListener("resize", updateBoardsPerPage);
    return () => window.removeEventListener("resize", updateBoardsPerPage);
  }, []);

  const totalPages = Math.ceil(boards.length / boardsPerPage);
  const startIndex = currentpageIndex * boardsPerPage;
  const currentBoards = boards.slice(startIndex, startIndex + boardsPerPage);

  const handleNextBoard = () => {
    if (currentpageIndex < totalPages - 1) {
      setCurrentpageIndex(currentpageIndex + 1);
    }
  };

  const handlePreviousBoard = () => {
    if (currentpageIndex > 0) {
      setCurrentpageIndex(currentpageIndex - 1);
    }
  };

  const countBoard = boards.length;

  return (
    <div className="flex">
      <aside
        className={`w-64 shadow-2xl shadow-slate-900 text-white 
bg-clip-padding backdrop-filter bg-white dark:bg-black 
bg-opacity-10 backdrop-blur-lg dark:bg-opacity-60 
dark:shadow-black p-4 flex flex-col 
transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-0"
        }`}
        style={{ width: isSidebarOpen ? "16rem" : "3rem" }}
      >
        {isSidebarOpen ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold mr-2 text-gray-800 dark:text-white">
                All Boards ({countBoard})
              </h2>
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-full"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="size-5"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.72 9.47a.75.75 0 0 0 0 1.06l4.25 4.25a.75.75 0 1 0 1.06-1.06L6.31 10l3.72-3.72a.75.75 0 1 0-1.06-1.06L4.72 9.47Zm9.25-4.25L9.72 9.47a.75.75 0 0 0 0 1.06l4.25 4.25a.75.75 0 1 0 1.06-1.06L11.31 10l3.72-3.72a.75.75 0 0 0-1.06-1.06Z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </>
        ) : (
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="mb-4 text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700  rounded-full flex items-center"
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
                d="m5.25 4.5 7.5 7.5-7.5 7.5m6-15 7.5 7.5-7.5 7.5"
              />
            </svg>
          </button>
        )}

        {isSidebarOpen && (
          <>
            <ul className="flex-grow">
              {currentBoards.map((board) => (
                <li key={board.id} className="mb-2">
                  <button
                    onClick={() => onSelectBoard(board)}
                    className="w-full text-left bg-slate-50 dark:bg-gray-700 bg-opacity-60 dark:bg-opacity-60 text-gray-700 dark:text-white rounded-lg p-4 shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {board.title}
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={handlePreviousBoard}
                disabled={currentpageIndex === 0}
                className="text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-full"
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
                    d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </button>
              <span className="text-lg font-semibold text-gray-700 dark:text-white">
                Page {currentpageIndex + 1} of {totalPages}
              </span>
              <button
                onClick={handleNextBoard}
                disabled={currentpageIndex === totalPages - 1}
                className="text-gray-700 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 p-2 rounded-full"
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
                    d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
              </button>
            </div>

            <div className="mt-auto relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="py-2 px-4 text-white text-gray-700 bg-clip-padding backdrop-filter 
             backdrop-blur-lg bg-opacity-70 bg-blue-500 
             hover:bg-opacity-30 rounded-lg shadow-lg 
             transition-colors duration-300"
              >
                New Board
              </button>

              {isDropdownOpen && (
                <div className="absolute bottom-full mb-2 bg-white dark:bg-gray-700 shadow-lg rounded p-4 w-64">
                  <h3 className="text-lg font-bold mb-2 text-gray-700 dark:text-white">
                    Create New Board
                  </h3>
                  <div className="mb-4">
                    <input
                      type="text"
                      value={newBoardTitle}
                      onChange={(e) => setNewBoardTitle(e.target.value)}
                      placeholder="Masukkan nama board baru"
                      className="border rounded p-2 w-full text-gray-800"
                    />
                  </div>
                  <button
                    onClick={handleAddBoard}
                    className="ml-2 text-white text-gray-700 bg-clip-padding backdrop-filter 
             backdrop-blur-lg bg-opacity-70 bg-blue-500 
             hover:bg-opacity-30 rounded-lg shadow-lg 
             transition-colors duration-300 p-2"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setNewBoardTitle("");
                    }}
                    className="ml-2 text-white text-gray-700 bg-clip-padding backdrop-filter 
             backdrop-blur-lg bg-opacity-70 bg-red-500 
             hover:bg-opacity-30 rounded-lg shadow-lg 
             transition-colors duration-300 p-2"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </aside>
      <ToastContainer ref={toastContainerRef} />
    </div>
  );
}
