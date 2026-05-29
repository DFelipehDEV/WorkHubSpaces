import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

function Logout() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/logout`, {
      method: 'GET',
      credentials: 'include'
    })
    .finally(() => {
      logout();
      navigate('/', { replace: true });
    });
  }, [navigate, logout]);

  return null;
}

export default Logout;