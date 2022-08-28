import { CoinWalletType, ObjectNumberOnly } from "@vending/types";
import { substractObjectsByKey, sumObjectsByKey } from ".";

export const coinVariants = [5, 10, 20, 50, 100];
export class Wallet {
  private coins: CoinWalletType;

  constructor(coins: CoinWalletType | undefined = undefined) {
    this.coins = coins ? coins : getEmptyWallet();
  }

  getBalanceInCoins(): CoinWalletType {
    return this.coins;
  }

  getBalanceInCents(): number {
    const keys = Object.keys(this.coins);
    return keys.reduce((previousValue, currentValue) => {
      const coinType = parseInt(currentValue);

      if (!coinVariants.includes(coinType)) {
        return previousValue;
      }

      return previousValue + coinType * this.coins[coinType];
    }, 0);
  }

  checkContains(coinsToCheck: CoinWalletType): boolean {
    const coinKeys = Object.keys(coinsToCheck);

    return coinKeys.every(
      (coinType) =>
        coinKeys.includes(coinType) &&
        coinsToCheck[coinType] <= this.coins[coinType]
    );
  }

  getChange(requiredInCents: number): CoinWalletType {
    let change = requiredInCents;
    const changeToReturn: CoinWalletType = {};

    coinVariants
      .sort((a, b) => b - a)
      .forEach((coinType) => {
        if (change >= coinType) {
          const numCoins = Math.floor(change / coinType);

          if (numCoins <= this.coins[coinType]) {
            change %= coinType;

            if (changeToReturn[coinType]) {
              changeToReturn[coinType] = changeToReturn[coinType] += numCoins;
            } else {
              changeToReturn[coinType] = numCoins;
            }
          }
        }
      });

    // return empty object if unable to give change
    return change === 0 ? changeToReturn : {};
  }

  addCoins(coinsToAdd: CoinWalletType) {
    this.coins = sumObjectsByKey(this.coins, coinsToAdd);
    return this;
  }

  removeCoins(coinsToRemove: CoinWalletType) {
    this.coins = substractObjectsByKey(this.coins, coinsToRemove);
    return this;
  }
}

const getEmptyWallet = (): CoinWalletType =>
  coinVariants.reduce((previousValue: ObjectNumberOnly, coinType) => {
    previousValue[coinType] = 0;
    return previousValue;
  }, {});
