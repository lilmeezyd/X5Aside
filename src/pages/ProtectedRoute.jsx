
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { userInfo, loading } = useSelector((state) => state.auth);
const location = useLocation();
  
  if (loading) return <p>Loading...</p>;
  if (!userInfo) return <Navigate to="/login" state={{ from: location }} replace />;
  return children;
}
