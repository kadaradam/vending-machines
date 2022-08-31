import { RolesEnum } from "@vending/types";
import { ROLE_ROUTER_NAMES } from "src/constants";
import PageNotFoundRoute from "./404";
import { BuyerDashboardRoute, SellerDashboardRoute } from "./dashboard";
import LoginRoute from "./login";
import RegisterRoute from "./register";
import RequireAuth from "./RequireAuth";
import RequireRole from "./RequireRole";
import RequireUnAuth from "./RequireUnAuth";
import RoleGuard from "./RoleGuard";
import { BuyerSettingsRoute, SellerSettingsRoute } from "./settings";

const buyerRoute = ROLE_ROUTER_NAMES[RolesEnum.BUYER];
const sellerRoute = ROLE_ROUTER_NAMES[RolesEnum.SELLER];

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
    path: `/${buyerRoute}/dashboard`,
    exact: true,
    element: (
      <RequireAuth>
        <RequireRole role={RolesEnum.BUYER}>
          <BuyerDashboardRoute />
        </RequireRole>
      </RequireAuth>
    ),
  },
  {
    path: `/${sellerRoute}/dashboard`,
    exact: true,
    element: (
      <RequireAuth>
        <RequireRole role={RolesEnum.SELLER}>
          <SellerDashboardRoute />
        </RequireRole>
      </RequireAuth>
    ),
  },
  {
    path: `/${buyerRoute}/settings`,
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
    path: `/${sellerRoute}/settings`,
    exact: true,
    element: (
      <RequireAuth>
        <RequireRole role={RolesEnum.SELLER}>
          <SellerSettingsRoute />
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
