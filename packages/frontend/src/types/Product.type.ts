import { CoinWalletType } from "src/utils";

export type ProductType = {
  _id: string;
  sellerId: string;
  productName: string;
  amountAvailable: CoinWalletType;
  cost: number;
};
