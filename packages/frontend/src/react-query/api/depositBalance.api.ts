import { CoinWalletType } from "@vending/types";
import axiosService from "../../axiosService";

export type DepositBalanceResponse = {};

export type DepositBalanceDto = {
  coins: CoinWalletType;
};

export async function depositBalance(
  depositBalanceDto: DepositBalanceDto
): Promise<DepositBalanceResponse> {
  const { data } = await axiosService.instance.put<DepositBalanceResponse>(
    "/users/buyer/deposit",
    depositBalanceDto
  );

  return data;
}
