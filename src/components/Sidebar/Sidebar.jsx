import React, { useState } from "react";
import { addData } from "../../utils/idb";
import { v4 as uuidv4 } from "uuid";

export default function Sidebar({ boards, onSelectBoard, setBoards }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleAddBoard = async () => {
    if (!newBoardTitle) {
      console.error("Nama board tidak boleh kosong");
      return;
    }
    const newBoard = {
      id: uuidv4(),
      title: newBoardTitle,
      columns: [
        { title: "Backlog", cards: [] },
        { title: "On Progress", cards: [] },
        { title: "Done", cards: [] },
      ],
    };
    await addData("boards", newBoard);
    setBoards((prevBoards) => [...prevBoards, newBoard]);
    setNewBoardTitle("");
    setIsDropdownOpen(false);
  };

  const countBoard = boards.length;

  return (
    <div className="flex">
      <aside
        className={`w-64 bg-blue-900 dark:bg-gray-900 bg-opacity-50 backdrop-blur-lg shadow-xl p-4 flex flex-col transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-0"
        }`}
        style={{ width: isSidebarOpen ? "16rem" : "3rem" }}
      >
        {isSidebarOpen ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold mr-2">
                All Boards ({countBoard})
              </h2>
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="text-white"
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
            className="mb-4 text-white flex items-center"
          >
            {/* Chevron Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="size-5"
            >
              <path
                fillRule="evenodd"
                d="M15.28 9.47a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 1 1-1.06-1.06L13.69 10 9.97 6.28a.75.75 0 0 1 1.06-1.06l4.25 4.25ZM6.03 5.22l4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.75.75 0 0 1-1.06-1.06L8.69 10 4.97 6.28a.75.75 0 0 1 1.06-1.06Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        )}

        {isSidebarOpen && (
          <>
            <ul className="flex-grow">
              {boards.map((board) => (
                <li key={board.id} className="mb-2">
                  <button
                    onClick={() => onSelectBoard(board)}
                    className="w-full text-left bg-gray-800 text-white rounded-lg p-4 shadow-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {board.title}
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-auto relative">
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="py-2 px-4 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Board
              </button>

              {isDropdownOpen && (
                <div className="absolute bottom-full mb-2 bg-white shadow-lg rounded p-4 w-64">
                  <h3 className="text-lg font-bold mb-2">Tambah Board Baru</h3>
                  <div className="mb-4">
                    <input
                      type="text"
                      value={newBoardTitle}
                      onChange={(e) => setNewBoardTitle(e.target.value)}
                      placeholder="Masukkan nama board baru"
                      className="border rounded p-2 w-full"
                    />
                  </div>
                  <button
                    onClick={handleAddBoard}
                    className="ml-2 bg-blue-500 text-white rounded p-2"
                  >
                    Tambah Board
                  </button>
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false);
                      setNewBoardTitle("");
                    }}
                    className="ml-2 bg-red-500 text-white rounded p-2"
                  >
                    Tutup
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
