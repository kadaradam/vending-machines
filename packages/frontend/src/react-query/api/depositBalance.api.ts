import { CoinWalletSchemaType } from "src/types";
import axiosService from "../../axiosService";

export type DepositBalanceResponse = {};

export type DepositBalanceDto = {
  coins: CoinWalletSchemaType;
};

export async function depositBalance(
  depositBalanceDto: DepositBalanceDto
): Promise<DepositBalanceResponse> {
  const { data } = await axiosService.instance.put<DepositBalanceResponse>(
    "/users/deposit",
    depositBalanceDto
  );

  return data;
}
