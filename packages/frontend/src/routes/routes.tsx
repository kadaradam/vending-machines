import { RolesEnum } from "src/types";
import PageNotFoundRoute from "./404";
import DashboardRoute from "./dashboard";
import LoginRoute from "./login";
import RegisterRoute from "./register";
import RequireAuth from "./RequireAuth";
import RequireRole from "./RequireRole";
import RequireUnAuth from "./RequireUnAuth";
import RoleGuard from "./RoleGuard";
import { BuyerSettingsRoute } from "./settings";

const routes = [
  {
    path: "/",
    exact: true,
    element: (
      <RequireAuth>
        <RoleGuard />
      </RequireAuth>
    ),
  },
  {
    path: "/buyer/dashboard",
    exact: true,
    element: (
      <RequireAuth>
        <RequireRole role={RolesEnum.BUYER}>
          <DashboardRoute />
        </RequireRole>
      </RequireAuth>
    ),
  },
  {
    path: "/buyer/settings",
    exact: true,
    element: (
      <RequireAuth>
        <RequireRole role={RolesEnum.BUYER}>
          <BuyerSettingsRoute />
        </RequireRole>
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
