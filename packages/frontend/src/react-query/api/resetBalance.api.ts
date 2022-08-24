import axiosService from "../../axiosService";

export type resetBalanceResponse = {};

export async function resetBalance(): Promise<resetBalanceResponse> {
  const { data } = await axiosService.instance.post<resetBalanceResponse>(
    "/users/reset"
  );

  return data;
}
