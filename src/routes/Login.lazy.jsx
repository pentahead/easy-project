import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import React, { useState, useEffect } from "react";
import ToastContainer from "../components/Toast/ToastContainer";

export const Route = createLazyFileRoute("/Login")({
  component: Login,
});

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const toastContainerRef = React.createRef();

  useEffect(() => {
    if (localStorage.getItem("isAuthenticated")) {
      navigate({ to: "/" });
    }
  }, [navigate]);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    if (username === "admin" && password === "password") {
      localStorage.setItem("isAuthenticated", true);
      localStorage.setItem("username", username);
      toastContainerRef.current.showToast("Successfully Logged in!", "success");
      navigate({ to: "/" });
    } else {
      toastContainerRef.current.showToast(
        "Username or password is incorrect!",
        "error"
      );
    }
    setIsLoading(false);
  };

  return (
    <body
      className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 bg-cover h-screen flex justify-center items-center"
      style={{ textShadow: "0px 1px 4px #77A" }}
    >
      <ToastContainer ref={toastContainerRef} />
      <div className="w-96 shadow-2xl shadow-slate-900 text-white bg-clip-padding backdrop-filter bg-white bg-opacity-10 backdrop-blur-md py-10 px-8 rounded-md">
        <div className="text-center text-2xl">Login</div>
        <form className="mt-6" onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              placeholder="Username"
              type="text"
              className="bg-white bg-white bg-opacity-10 hover:bg-opacity-20 transition duration-500 shadow-inner shadow-slate-600/90 rounded-md p-3 outline-none w-full"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              placeholder="Password"
              type="password"
              className="bg-white bg-white bg-opacity-10 hover:bg-opacity-20 transition duration-500 shadow-inner shadow-slate-600/90 rounded-md p-3 outline-none w-full"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            className="mt-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-indigo-500 hover:to-blue-500 transition duration-500 rounded-md shadow-md shadow-slate-600/70 p-3 w-full font-semibold"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="animate-spin">Loading...</span>
            ) : (
              "Login"
            )}
          </button>
        </form>
      </div>
    </body>
  );
}
