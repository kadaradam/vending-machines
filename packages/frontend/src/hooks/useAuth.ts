import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAppContext } from "src/AppContext";
import axiosService from "src/axiosService";
import { STORAGE_AUTH_TOKEN_KEY } from "src/constants";
import { AutoLoginApiResponse, LoginApiResponse } from "src/react-query/api";
import { LocationState } from "src/routes/RequireAuth";

export function useAuth() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUserLoggedIn } = useAppContext();

  function handleSuccessRegister() {
    axiosService.refreshRequestHandler(null);

    toast.success("Registered Successfully");

    setUserLoggedIn(true);
    navigate("/login", { replace: true });
  }

  function handleSuccessLogin(response: LoginApiResponse) {
    window.localStorage.setItem(STORAGE_AUTH_TOKEN_KEY, response.access_token);
    axiosService.refreshRequestHandler(response.access_token);

    const state = location.state as LocationState;
    const from = state?.from?.pathname || "/";

    setUserLoggedIn(true);
    navigate(from, { replace: true });
  }

  function handleLogout() {
    window.localStorage.removeItem(STORAGE_AUTH_TOKEN_KEY);

    setUserLoggedIn(false);
    navigate("/login", { replace: true });
  }

  function prepareAutoLogin(): boolean {
    const authToken = window.localStorage.getItem(STORAGE_AUTH_TOKEN_KEY);

    if (!authToken) {
      return false;
    }

    axiosService.refreshRequestHandler(authToken);

    return true;
  }

  function handleAutoLogin(response: AutoLoginApiResponse) {
    setUserLoggedIn(true);
    navigate("/", { replace: true });
  }

  return {
    handleSuccessRegister,
    handleSuccessLogin,
    handleLogout,
    handleAutoLogin,
    prepareAutoLogin,
  };
}
