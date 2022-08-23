import { UserType } from "src/types";
import axiosService from "../../axiosService";

export type RegisterApiDto = {
  username: string;
  password: string;
};

export type RegisterApiResponse = UserType;

export async function registerApi(
  registerDto: RegisterApiDto
): Promise<RegisterApiResponse> {
  const { data } = await axiosService.instance.post<RegisterApiResponse>(
    "/auth/register",
    registerDto
  );

  return data;
}
