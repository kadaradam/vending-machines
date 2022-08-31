import { useQuery } from "@tanstack/react-query";
import { RolesEnum } from "@vending/types";
import { Navigate } from "react-router-dom";
import { getMyUserApi } from "src/react-query/api";

export default function RequireRole({
  role,
  children,
}: {
  children: JSX.Element;
  role: RolesEnum;
}) {
  const { data: user, isLoading } = useQuery(["user"], getMyUserApi);

  if (isLoading || !user) {
    // TODO Add loading screen
    return null;
  }

  if (user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}
