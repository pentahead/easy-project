import { createFileRoute } from "@tanstack/react-router";
import React, { useState, useEffect } from "react";
import ToastContainer from "../components/Toast/ToastContainer";
import Navbar from "../components/Navbar/Navbar";
import Protected from "../components/Auth/Protected";

export const Route = createFileRoute("/Profile")({
  component: () => (
    <Protected>
      <Profile />
    </Protected>
  ),
});

function Profile() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
  const [fullName, setFullName] = useState(
    localStorage.getItem("fullName") || ""
  );
  const [nickName, setNickName] = useState(
    localStorage.getItem("nickName") || ""
  );
  const [gender, setGender] = useState(localStorage.getItem("gender") || "");
  const [bio, setBio] = useState(localStorage.getItem("bio") || "");
  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage") || ""
  );
  const [isEditing, setIsEditing] = useState(false);
  const toastContainerRef = React.createRef();

  const handleSave = () => {
    localStorage.setItem("username", username);
    localStorage.setItem("fullName", fullName);
    localStorage.setItem("nickName", nickName);
    localStorage.setItem("gender", gender);
    localStorage.setItem("bio", bio);
    localStorage.setItem("profileImage", profileImage);
    setIsEditing(false);
    toastContainerRef.current.showToast("Successfully Saved!", "success");
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetToLocalStorage = () => {
    setUsername(localStorage.getItem("username") || "");
    setFullName(localStorage.getItem("fullName") || "");
    setNickName(localStorage.getItem("nickName") || "");
    setGender(localStorage.getItem("gender") || "");
    setBio(localStorage.getItem("bio") || "");
    setProfileImage(localStorage.getItem("profileImage") || "");
  };

  return (
    <div
      className="bg-light-bg dark:bg-dark-bg bg-cover h-screen flex flex-col "
      style={{ textShadow: "0px 1px 4px #77A" }}
    >
      <Navbar className="w-full" />
      <div className="flex flex-1 flex-col md:flex-row justify-center items-center ">
        <div className="w-full max-w-md md:max-w-lg lg:max-w-xl h-[80%] overflow-y-auto shadow-2xl shadow-slate-900 text-white bg-clip-padding backdrop-filter bg-white dark:bg-dark bg-opacity-10 backdrop-blur-md py-10 px-8 rounded-md relative">
          <div className="h-32 md:h-40 w-full bg-[url('../../assets/banner.png')] bg-cover bg-center rounded-t-md bg-indigo-500"></div>

          <div className="relative -mt-16 flex justify-center mb-4">
            <div className="w-24 md:w-32 h-24 md:h-32 rounded-full overflow-hidden border-4 border-white relative">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-700">
                  No Image
                </div>
              )}
              {isEditing && (
                <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 cursor-pointer">
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

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              )}
            </div>
          </div>

          <h2 className="text-center text-gray-800 dark:text-white text-xl md:text-2xl lg:text-3xl mb-4">
            Profile
          </h2>

          <button
            onClick={() => setIsEditing(true)}
            className="absolute top-4 right-4 text-gray-800 dark:text-white hover:text-gray-300"
            hidden={isEditing}
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
          </button>

          {/* Profile Fields */}
          {[
            { label: "Username", value: username, setter: setUsername },
            { label: "Full Name", value: fullName, setter: setFullName },
            { label: "Nick Name", value: nickName, setter: setNickName },
            {
              label: "Gender",
              value: gender,
              setter: setGender,
              isSelect: true,
            },
            { label: "Bio", value: bio, setter: setBio, isTextArea: true },
          ].map(({ label, value, setter, isSelect, isTextArea }, index) => (
            <div className="mb-4 flex items-center w-full" key={index}>
              <label className="font-medium mr-4 w-1/3 text-gray-800 dark:text-white text-sm md:text-base">
                {label}:
              </label>
              {isEditing ? (
                isSelect ? (
                  <select
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    className="bg-white text-gray-800 dark:text-white bg-opacity-10 hover:bg-opacity-20 transition duration-500 shadow-inner shadow-slate-600/90 rounded-md p-3 outline-none w-2/3"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                ) : isTextArea ? (
                  <textarea
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    className="bg-white text-gray-800 dark:text-white bg-opacity-10 hover:bg-opacity-20 transition duration-500 shadow-inner shadow-slate-600/90 rounded-md p-3 outline-none w-2/3"
                    rows={2}
                  ></textarea>
                ) : (
                  <input
                    type="text"
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    className="bg-white text-gray-800 dark:text-white bg-opacity-10 hover:bg-opacity-20 transition duration-500 shadow-inner shadow-slate-600/90 rounded-md p-3 outline-none w-2/3"
                  />
                )
              ) : (
                <p className="bg-white text-gray-800 dark:text-white bg-opacity-10 p-3 rounded-md shadow-inner shadow-slate-600/90 w-full">
                  {value || "Not specified"}
                </p>
              )}
            </div>
          ))}

          {isEditing && (
            <>
              <button
                onClick={handleSave}
                className="mt-4 py-2 px-4 bg-green-500 bg-opacity-80 hover:bg-opacity-20 text-white font-medium shadow-lg shadow-slate-500/30 backdrop-blur-md border border-white border-opacity-20 rounded-md transition duration-300"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  resetToLocalStorage();
                }}
                className="ml-2 py-2 px-4 bg-red-500 bg-opacity-80 hover:bg-opacity-20 text-white font-medium shadow-lg shadow-slate-500/30 backdrop-blur-md border border-white border-opacity-20 rounded-md transition duration-300"
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
      <ToastContainer ref={toastContainerRef} />
    </div>
  );
}
