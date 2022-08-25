import { CoinWalletType } from "src/utils";
import { RolesEnum } from ".";

export type UserType = {
  username: string;
  role: RolesEnum;
  deposit: CoinWalletType;
};
