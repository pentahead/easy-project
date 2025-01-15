import { createLazyFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import Protected from "../components/Auth/Protected";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import Board from "../components/Board/Board";
import { addData, getAllData, deleteData, updateData } from "../utils/idb";

export const Route = createLazyFileRoute("/")({
  component: () => (
    <Protected>
      <Index />
    </Protected>
  ),
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

  return (
    <div
      className="h-screen flex flex-col bg-light-bg dark:bg-dark-bg bg-cover"
      style={{ textShadow: "0px 1px 2px #77A" }}
    >
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
            <h1 className="text-xl font-bold text-gray-800 dark:text-white text-start md:text-start">
              Welcome to Easy Project App! lets build cool Project together
            </h1>
            <form className="px-2 ml-auto mb-2">
              <label
                htmlFor="default-search"
                className="sr-only text-sm font-medium text-gray-900 dark:text-white"
              >
                Search
              </label>
              <div className="flex items-center bg-gray-50 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600">
                <div className="flex items-center px-3">
                  <svg
                    className="w-4 h-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                    aria-label="Search Icon"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                    />
                  </svg>
                </div>
                <input
                  type="search"
                  id="default-search"
                  className="flex-1 p-4 text-sm text-gray-900 bg-transparent border-none focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="Search by keyword"
                  aria-label="Search"
                  required
                />
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
            </>
          ) : (
            <p className="text-gray-800 mt-20 dark:text-white text-center">
              Silakan pilih board dari sidebar
            </p>
          )}
        </main>
      </div>
    </div>
  );
}

export default Index;
