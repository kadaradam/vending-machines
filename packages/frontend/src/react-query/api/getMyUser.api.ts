import { UserType } from "src/types";
import axiosService from "../../axiosService";

export type getMyUserApiResponse = UserType;

export async function getMyUserApi(): Promise<getMyUserApiResponse> {
  const { data } = await axiosService.instance.get<getMyUserApiResponse>(
    "/users"
  );

  return data;
}
