import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  // 🔐 If not logged in → redirect to login
  if (!token) {
    return <Navigate to="/" />;
  }

  // ✅ If logged in → render page
  return children;
};

export default ProtectedRoute;





