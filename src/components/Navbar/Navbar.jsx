import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const username = localStorage.getItem("username") || "User";
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("username");
    navigate({ to: "/Login" });
  };

  const handleProfile = () => {
    navigate({ to: "/Profile" });
  };
  const profileImage =
    localStorage.getItem("profileImage") ||
    "https://www.w3schools.com/w3images/avatar2.png";

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <nav className="flex justify-between items-center p-4 bg-blue-800 dark:bg-gray-800 bg-opacity-50 backdrop-blur-lg rounded-lg shadow-xl">
      <h1 className="text-xl font-bold text-white">Easy Project</h1>
      <div className="flex items-center">
        <button
          className="mr-4 text-white"
          onClick={() => setDarkMode((prev) => !prev)}
        >
          {darkMode ? "☀️" : "🌙"}
        </button>
        <span className="cursor-pointer font-medium text-white pr-3">
          {username}
        </span>

        <div className="relative">
          <img
            src={profileImage}
            alt="Profile"
            className="w-8 h-8 rounded-full cursor-pointer"
            onClick={() => setDropdownOpen((prev) => !prev)}
          />
          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 text-black dark:text-white shadow-lg rounded-md p-2 z-10">
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={handleProfile}
              >
                Profile
              </button>
              <button
                className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
