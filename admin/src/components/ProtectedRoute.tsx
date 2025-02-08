import { useAuthStore } from "@/store/authStore";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const user = useAuthStore((state) => state.user);
  const checkAuth = useAuthStore((state) => state.checkAuth);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth().then(() => {
      if (!user) {
        navigate("/login");
      }
    });
  }, [user, navigate, checkAuth]);

  return user ? children : null;
};

export default ProtectedRoute;
