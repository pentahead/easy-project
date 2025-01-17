import { createLazyFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import Protected from "../components/Auth/Protected";
import Navbar from "../components/Navbar/Navbar";
import Sidebar from "../components/Sidebar/Sidebar";
import Board from "../components/Board/Board";
import { getAllBoards } from "../services/board";
import { debounce } from "lodash";

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

  const handleBoardUpdate = (board) => {
    setSelectedBoard(board);
    if (board) {
      localStorage.setItem("selectedBoardId", board.id);
    } else {
      localStorage.removeItem("selectedBoardId");
    }
  };

  // Load boards on initial render
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const result = await getAllBoards();
        if (result.success) {
          setBoards(result.data);
          const savedBoardId = localStorage.getItem("selectedBoardId");
          if (savedBoardId) {
            const savedBoard = result.data.find(
              (board) => board.id === savedBoardId
            );
            if (savedBoard) {
              setSelectedBoard(savedBoard);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching boards:", error);
      }
    };

    fetchBoards();
  }, []);

  //  update boards
  useEffect(() => {
    const handleBoardUpdate = debounce(async () => {
      try {
        const result = await getAllBoards();
        if (result.success) {
          setBoards(result.data);
        }
      } catch (error) {
        console.error("Error updating boards:", error);
      }
    }, 300);

    const events = ["boardUpdated", "boardAdded", "boardDeleted"];
    events.forEach((event) =>
      window.addEventListener(event, handleBoardUpdate)
    );

    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, handleBoardUpdate)
      );
      handleBoardUpdate.cancel();
    };
  }, []);

  return (
    <div
      className="h-screen flex flex-col bg-light-bg dark:bg-dark-bg bg-cover"
      style={{ textShadow: "0px 1px 2px #77A" }}
    >
      <Navbar className="w-full" />
      <div className="flex flex-1 flex-col md:flex-row">
        <Sidebar
          boards={boards}
          onSelectBoard={handleBoardUpdate}
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
            <Board
              selectedBoard={selectedBoard}
              onBoardUpdate={handleBoardUpdate}
            />
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
