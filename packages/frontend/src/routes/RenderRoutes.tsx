import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { useAuth } from "src/hooks";
import { AutoLoginApi } from "src/react-query/api";
import routes from "./routes";

export const RenderRoutes = () => {
  const [isAxiosReady, setIsAxiosReady] = useState<boolean>(false);
  const { handleAutoLogin, prepareAutoLogin } = useAuth();

  const { isLoading: isAutoLoginLoading } = useQuery(["user"], AutoLoginApi, {
    enabled: isAxiosReady,
    onSuccess: (response) => handleAutoLogin(response),
  });

  useEffect(() => {
    const isSuccess = prepareAutoLogin();

    if (isSuccess) {
      setIsAxiosReady(true);
    }
  }, [prepareAutoLogin]);

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
