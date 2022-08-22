import axiosService from "../../axiosService";

export type LoginApiDto = {
  username: string;
  password: string;
};

export type LoginApiResponse = {
  access_token: string;
};

export async function loginApi(
  loginDto: LoginApiDto
): Promise<LoginApiResponse> {
  const { data } = await axiosService.instance.post<LoginApiResponse>(
    "/auth/login",
    loginDto
  );

  return data;
}
