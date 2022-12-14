import { Box, CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import { useAuth } from "src/hooks";
import { getMyUserApi } from "src/react-query/api";
import routes from "./routes";

export const RenderRoutes = () => {
  const [isAxiosReady, setIsAxiosReady] = useState<boolean>(false);
  const [isAppLoaded, setAppLoaded] = useState<boolean>(false);
  const { handleAutoLogin, prepareAutoLogin } = useAuth();

  useQuery(["user"], getMyUserApi, {
    enabled: isAxiosReady,
    onSuccess: (response) => {
      handleAutoLogin(response);
      setAppLoaded(true);
    },
    retry: 1,
  });

  useEffect(() => {
    const isSuccess = prepareAutoLogin();

    if (isSuccess) {
      setIsAxiosReady(true);
    } else {
      setAppLoaded(true);
    }
  }, [prepareAutoLogin]);

  // IMPORTANT
  // Do not render the routes, until the app is loaded
  // First we have to try to login automatically
  // The auth guard will catch the user not loged in, which can cause infinite requests
  if (!isAppLoaded) {
    return (
      <Box
        sx={{
          height: "100vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={64} />
      </Box>
    );
  }

  return (
    <Routes>
      {routes.map((route, index) => (
        <Route {...route} key={index} />
      ))}
    </Routes>
  );
};
