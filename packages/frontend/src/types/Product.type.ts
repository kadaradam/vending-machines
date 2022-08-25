import { CoinWalletSchemaType } from ".";

export type ProductType = {
  _id: string;
  sellerId: string;
  productName: string;
  amountAvailable: CoinWalletSchemaType;
  cost: number;
};
