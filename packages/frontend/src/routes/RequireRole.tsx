import { useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";
import { AutoLoginApi } from "src/react-query/api";
import { RolesEnum } from "src/types";

export default function RequireRole({
  role,
  children,
}: {
  children: JSX.Element;
  role: RolesEnum;
}) {
  const { data: user, isLoading } = useQuery(["user"], AutoLoginApi);

  if (isLoading || !user) {
    // TODO Add loading screen
    return null;
  }

  if (user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return children;
}
