import { Navigate } from "react-router-dom";
import { useAppContext } from "src/AppContext";

export default function RequireUnAuth({ children }: { children: JSX.Element }) {
  const { userLoggedIn } = useAppContext();

  if (userLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
}
