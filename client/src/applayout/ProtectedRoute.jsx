import { Navigate, useParams } from 'react-router-dom';
const ProtectedRoute = ({ children }) => {
  const { roomid } = useParams();
  const isAuthenticated = localStorage.getItem(`room-${roomid}-auth`) === 'true';
  if (!isAuthenticated) {
    return <Navigate to="/404" replace />;
  }
  return children;
};
export default ProtectedRoute;