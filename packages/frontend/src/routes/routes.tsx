import PageNotFoundRoute from "./404";
import DashboardRoute from "./dashboard";
import LoginRoute from "./login";
import ProfileRoute from "./profile";
import RegisterRoute from "./register";
import RequireAuth from "./RequireAuth";
import RequireUnAuth from "./RequireUnAuth";

const routes = [
  {
    path: "/",
    exact: true,
    element: (
      <RequireAuth>
        <DashboardRoute />
      </RequireAuth>
    ),
  },
  {
    path: "/profile",
    exact: true,
    element: (
      <RequireAuth>
        <ProfileRoute />
      </RequireAuth>
    ),
  },
  {
    path: "/login",
    exact: true,
    element: (
      <RequireUnAuth>
        <LoginRoute />
      </RequireUnAuth>
    ),
  },
  {
    path: "/register",
    exact: true,
    element: (
      <RequireUnAuth>
        <RegisterRoute />
      </RequireUnAuth>
    ),
  },
  {
    path: "*",
    element: (
      <RequireAuth>
        <PageNotFoundRoute />
      </RequireAuth>
    ),
  },
];

export default routes;
