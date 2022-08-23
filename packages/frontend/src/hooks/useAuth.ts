import { useNavigate } from "react-router-dom";
import { useAppContext } from "src/AppContext";
import { STORAGE_AUTH_TOKEN_KEY } from "src/constants";
import { LoginApiResponse } from "src/react-query/api";

export function useAuth() {
  const navigate = useNavigate();
  const { setUserLoggedIn } = useAppContext();

  function handleSuccessRegister(response: any) {
    setUserLoggedIn(true);
    navigate("/login", { replace: true });
  }

  function handleSuccessLogin(response: LoginApiResponse) {
    window.localStorage.setItem(STORAGE_AUTH_TOKEN_KEY, response.access_token);

    setUserLoggedIn(true);
    navigate("/dashboard", { replace: true });
  }

  function handleSuccessLogout(response: any) {
    window.localStorage.removeItem(STORAGE_AUTH_TOKEN_KEY);

    setUserLoggedIn(false);
    navigate("/login", { replace: true });
  }

  return { handleSuccessRegister, handleSuccessLogin, handleSuccessLogout };
}
