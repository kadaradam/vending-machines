import PageNotFoundRoute from "./404";
import DashboardRoute from "./dashboard";
import LoginRoute from "./login";
import RegisterRoute from "./register";

const routes = [
  {
    path: "/",
    exact: true,
    element: <DashboardRoute />,
  },
  {
    path: "/login",
    exact: true,
    element: <LoginRoute />,
  },
  {
    path: "/register",
    exact: true,
    element: <RegisterRoute />,
  },
  {
    path: "*",
    element: <PageNotFoundRoute />,
  },
];

export default routes;
