import { CoinWalletType } from "@vending/types";

export type ProductType = {
  _id: string;
  sellerId: string;
  productName: string;
  amountAvailable: CoinWalletType;
  cost: number;
};
