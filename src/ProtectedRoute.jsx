import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ user, children, loading }) {

   if (loading) return <div>Loading...</div>;
  if (!user) return <Navigate to="/" replace />;
  return children;
}
