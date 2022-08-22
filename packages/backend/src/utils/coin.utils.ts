import { CoinWalletType } from 'src/types';

const sumObjectsByKey = (...objs) => {
	const res = objs.reduce((a, b) => {
		for (const k in b) {
			if (b.hasOwnProperty(k)) a[k] = (a[k] || 0) + b[k];
		}
		return a;
	}, {});
	return res;
};

const substractObjectsByKey = (from, to) => {
	return Object.keys(from).reduce((previousValue, currentValue) => {
		const coinType = parseInt(currentValue);

		previousValue[coinType] = to[coinType] ? from[coinType] - to[coinType] : from[coinType];
		return previousValue;
	}, {});
};

export const coinVariants = [5, 10, 20, 50, 100];

export const getEmptyWallet = (): CoinWalletType =>
	coinVariants.reduce((previousValue, coinType) => {
		previousValue[coinType] = 0;
		return previousValue;
	}, {});

export function calculateChanges(cents: number): CoinWalletType {
	let amount = cents;
	const coinChanges: CoinWalletType = {};

	coinVariants
		.sort((a, b) => b - a)
		.forEach((coinType) => {
			coinChanges[coinType] = Math.round(amount / coinType);
			amount = amount % coinType;
		});

	return coinChanges;
}

export function Wallet(coins: CoinWalletType) {
	return {
		coins,
		getBalance() {
			const keys = Object.keys(this.coins);
			return keys.reduce((previousValue, currentValue) => {
				const coinType = parseInt(currentValue);

				if (!coinVariants.includes(coinType)) {
					return previousValue;
				}

				return previousValue + coinType * this.coins[coinType];
			}, 0);
		},
		addCoins(coinsToAdd: CoinWalletType) {
			this.coins = sumObjectsByKey(this.coins, coinsToAdd);
			return this;
		},
		removeCoins(coinsToRemove: CoinWalletType) {
			this.coins = substractObjectsByKey(this.coins, coinsToRemove);
			return this;
		},
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
			return changeToReturn;
		},
		checkContains(coinsToCheck: CoinWalletType) {
			return Object.keys(coinsToCheck).every(
				(coinType) =>
					Object.keys(coinsToCheck).includes(coinType) &&
					coinsToCheck[coinType] <= this.coins[coinType],
			);
		},
	};
}

	return coinChanges;
}
