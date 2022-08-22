import PageNotFoundRoute from "./404";
import DashboardRoute from "./dashboard";
import LoginRoute from "./login";
import RegisterRoute from "./register";

const routes = [
  {
    path: "/",
    exact: true,
    component: DashboardRoute,
  },
  {
    path: "/login",
    exact: true,
    component: LoginRoute,
  },
  {
    path: "/register",
    exact: true,
    component: RegisterRoute,
  },
  {
    path: "*",
    component: PageNotFoundRoute,
  },
];

export default routes;
