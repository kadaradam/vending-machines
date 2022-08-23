import { CoinWalletSchemaType, RolesEnum } from ".";

export type UserType = {
  username: string;
  role: RolesEnum;
  deposit: CoinWalletSchemaType;
};
