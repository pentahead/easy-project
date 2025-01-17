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
  const [searchKeyword, setSearchKeyword] = useState("");

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

  //load and stiore search on local storage
  useEffect(() => {
    const savedKeyword = localStorage.getItem("searchKeyword");
    if (savedKeyword) {
      setSearchKeyword(savedKeyword);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("searchKeyword", searchKeyword);
  }, [searchKeyword]);

  const handleSearchChange = (event) => {
    setSearchKeyword(event.target.value);
  };

  const filteredBoards = boards.filter(
    (board) =>
      board.title &&
      board.title.toLowerCase().includes(searchKeyword.toLowerCase())
  );
  
  return (
    <div
    className="h-screen flex flex-col bg-light-bg dark:bg-dark-bg bg-cover overflow-y-auto"
    style={{ textShadow: "0px 1px 2px #77A" }}
  >
    <Navbar className="w-full" />
    <div className="flex flex-1 flex-col md:flex-row">
      {/* Sidebar */}
      <Sidebar
        boards={boards}
        onSelectBoard={handleBoardUpdate}
        className="h-full w-full md:w-1/4"
      />
      {/* Main Content */}
      <main className="flex-1 p-4 flex flex-col">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          {/* Welcome Header */}
          <h1 className="text-xl font-bold text-gray-800 dark:text-white text-start md:text-start">
            Welcome to Easy Project App! Let's build cool Projects together
          </h1>
          {/* Search Form */}
          <form className="mt-4 md:mt-0 md:ml-auto mb-2 relative">
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
                value={searchKeyword}
                onChange={handleSearchChange}
                required
              />
            </div>
            {searchKeyword && (
              <ul className="absolute bg-white border border-gray-300 rounded-lg mt-1 w-full max-h-60 overflow-y-auto dark:bg-gray-700 dark:border-gray-600 z-10">
                {filteredBoards.map((board) => (
                  <li
                    key={board.id}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-white cursor-pointer"
                    onClick={() => handleBoardUpdate(board)}
                  >
                    {board.title}
                  </li>
                ))}
              </ul>
            )}
          </form>
        </div>
  
        {/* Content */}
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
