import { CoinWalletType } from "src/utils";
import axiosService from "../../axiosService";

export type GetSellerBalanceResponse = CoinWalletType;

export async function getSellerBalanceApi(): Promise<GetSellerBalanceResponse> {
  const { data } = await axiosService.instance.get<GetSellerBalanceResponse>(
    "/users/all-balance"
  );

  return data;
}
