import { createLazyFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import Board from "../components/Board/Board";
import { addData, getAllData, deleteData, updateData } from "../utils/idb";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [newBoardTitle, setNewBoardTitle] = useState("");
  const [currentBoardIndex, setCurrentBoardIndex] = useState(0);

  useEffect(() => {
    const fetchBoards = async () => {
      const data = await getAllData("boards");
      if (Array.isArray(data)) {
        setBoards(data);
        const savedBoardId = localStorage.getItem("selectedBoardId");
        if (savedBoardId) {
          const savedBoard = data.find((board) => board.id === savedBoardId);
          if (savedBoard) {
            setSelectedBoard(savedBoard);
          }
        }
      } else {
        console.error("Data yang diterima bukan array:", data);
      }
    };
    fetchBoards();
  }, []);

  const handleSelectBoard = (board) => {
    setSelectedBoard(board);
    localStorage.setItem("selectedBoardId", board.id);
  };

  const handleEditBoard = async (id, newTitle) => {
    const updatedBoard = {
      ...boards.find((board) => board.id === id),
      title: newTitle,
    };
    await updateData("boards", id, updatedBoard);
    setBoards((prevBoards) =>
      prevBoards.map((board) => (board.id === id ? updatedBoard : board))
    );
  };

  const handleAddColumn = (newColumn) => {
    if (selectedBoard) {
      const updatedBoard = {
        ...selectedBoard,
        columns: [...selectedBoard.columns, newColumn],
      };
      setSelectedBoard(updatedBoard);
      setBoards((prevBoards) =>
        prevBoards.map((board) =>
          board.id === selectedBoard.id ? updatedBoard : board
        )
      );
    }
  };

  const handleDeleteBoard = async (id) => {
    if (!id) {
      console.error("ID tidak valid untuk menghapus board");
      return;
    }
    await deleteData("boards", id);
    setBoards((prevBoards) => prevBoards.filter((board) => board.id !== id));
    if (selectedBoard && selectedBoard.id === id) {
      setSelectedBoard(null);
      localStorage.removeItem("selectedBoardId");
    }
  };
  const handleNextBoard = () => {
    if (currentBoardIndex < boards.length - 1) {
      setCurrentBoardIndex(currentBoardIndex + 1);
      setSelectedBoard(boards[currentBoardIndex + 1]);
    }
  };

  const handlePreviousBoard = () => {
    if (currentBoardIndex > 0) {
      setCurrentBoardIndex(currentBoardIndex - 1);
      setSelectedBoard(boards[currentBoardIndex - 1]);
    }
  };
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 dark:bg-gray-800">
      <Navbar className="w-full" />
      <div className="flex flex-1 flex-col md:flex-row">
        <Sidebar
          boards={boards}
          setBoards={setBoards}
          // onSelectBoard={handleSelectBoard}
          onSelectBoard={(board) => {
            setSelectedBoard(board);
            setCurrentBoardIndex(boards.indexOf(board));
          }}
          className="h-full w-full md:w-1/4"
        />
        <main className="flex-1 p-4 flex flex-col">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-start md:text-start">
              Welcome to Easy Project App! lets build cool Project together{" "}
            </h1>
            <form class="max-w-md mx-auto">
              <label
                for="default-search"
                class="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white"
              >
                Search
              </label>
              <div class="relative">
                <div class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                  <svg
                    class="w-4 h-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                  >
                    <path
                      stroke="currentColor"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input
                  type="search"
                  id="default-search"
                  class="block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Search Mockups, Logos..."
                  required
                />
                <button
                  type="submit"
                  class="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
          {selectedBoard ? (
            <>
              <Board
                title={selectedBoard.title}
                onEdit={(newTitle) =>
                  handleEditBoard(selectedBoard.id, newTitle)
                }
                onDelete={() => {
                  handleDeleteBoard(selectedBoard.id);
                  setSelectedBoard(null);
                }}
                initialColumns={selectedBoard.columns}
                onAddColumn={handleAddColumn}
                selectedBoard={selectedBoard}
              />
              <div className="flex justify-between items-center mb-4">
                <button
                  onClick={handlePreviousBoard}
                  disabled={currentBoardIndex === 0}
                  className="bg-gray-300 p-2 rounded"
                >
                  Previous
                </button>
                <span className="text-lg font-semibold">
                  {selectedBoard.title}
                </span>
                <button
                  onClick={handleNextBoard}
                  disabled={currentBoardIndex === boards.length - 1}
                  className="bg-gray-300 p-2 rounded"
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <p className="text-gray-600 text-center">
              Silakan pilih board dari sidebar.
            </p>
          )}
        </main>
      </div>
    </div>
  );
}

export default Index;
