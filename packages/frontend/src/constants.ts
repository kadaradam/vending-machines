import { RolesEnum } from "@vending/types";

export const STORAGE_AUTH_TOKEN_KEY = "auth";

export const ROLE_ROUTER_NAMES = {
  [RolesEnum.BUYER]: RolesEnum.BUYER.toLowerCase(),
  [RolesEnum.SELLER]: RolesEnum.SELLER.toLowerCase(),
};
