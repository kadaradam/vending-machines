import { useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";
import { ROLE_ROUTER_NAMES } from "src/constants";
import { getMyUserApi } from "src/react-query/api";
import { RolesEnum } from "src/types";

export default function RoleGuard() {
  const { data: user, isLoading } = useQuery(["user"], getMyUserApi);

  if (isLoading || !user) {
    // TODO Add loading screen
    return null;
  }

  if (user.role === RolesEnum.BUYER) {
    return (
      <Navigate
        to={`/${ROLE_ROUTER_NAMES[RolesEnum.BUYER]}/dashboard`}
        replace
      />
    );
  } else if (user.role === RolesEnum.SELLER) {
    return (
      <Navigate
        to={`/${ROLE_ROUTER_NAMES[RolesEnum.SELLER]}/dashboard`}
        replace
      />
    );
  }

  return null;
}
