import { CoinWalletType } from "@vending/types";
import axiosService from "../../axiosService";

export type GetSellerBalanceResponse = CoinWalletType;

export async function getSellerBalanceApi(): Promise<GetSellerBalanceResponse> {
  const { data } = await axiosService.instance.get<GetSellerBalanceResponse>(
    "/users/seller/balance"
  );

  return data;
}
