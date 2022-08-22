import { Route, Routes } from "react-router-dom";
import routes from "./routes";

export const RenderRoutes = () => (
  <Routes>
    {routes.map((route, index) => (
      <Route {...route} key={index} />
    ))}
  </Routes>
);
