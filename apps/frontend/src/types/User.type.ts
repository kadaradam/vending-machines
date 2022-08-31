import { CoinWalletType, RolesEnum } from "@vending/types";

export type UserType = {
  username: string;
  role: RolesEnum;
  deposit: CoinWalletType;
};
