import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { useAuth } from "src/hooks";
import { AutoLoginApi } from "src/react-query/api";
import routes from "./routes";

export const RenderRoutes = () => {
  const { handleAutoLogin } = useAuth();
  const { mutate: autoLogin, isLoading: isAutoLoginLoading } = useMutation(
    AutoLoginApi,
    {
      onSuccess: (response) => handleAutoLogin(response),
    }
  );

  useEffect(() => autoLogin(), [autoLogin]);

  if (isAutoLoginLoading) {
    // TODO Add spinning
    return null;
  }

  return (
    <Routes>
      {routes.map((route, index) => (
        <Route {...route} key={index} />
      ))}
    </Routes>
  );
};
