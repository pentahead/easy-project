import { useNavigate } from "@tanstack/react-router";

const Protected = ({ children }) => {
  const navigate = useNavigate();

  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"; // Pastikan isAuthenticated adalah boolean

  if (!isAuthenticated) {
    navigate({ to: "/login" });
    return null;
  }

  return children;
};

export default Protected;
