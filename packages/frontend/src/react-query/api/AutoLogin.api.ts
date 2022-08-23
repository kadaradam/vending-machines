import { UserType } from "src/types";
import axiosService from "../../axiosService";

export type AutoLoginApiResponse = UserType;

export async function AutoLoginApi(): Promise<AutoLoginApiResponse> {
  const { data } = await axiosService.instance.get<AutoLoginApiResponse>(
    "/users"
  );

  return data;
}
