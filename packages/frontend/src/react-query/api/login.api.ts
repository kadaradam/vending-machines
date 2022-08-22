import axiosService from "../../axiosService";

type LoginApiDto = {
  username: string;
  password: string;
};

type LoginApiResponse = {
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
