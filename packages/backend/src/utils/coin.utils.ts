import { CoinWalletType } from 'src/types';

export const coinVariants = [5, 10, 20, 50, 100];

export const getEmptyWallet = (): CoinWalletType[] =>
	coinVariants.map((coinType) => ({ [coinType]: 0 }));

export const getCoinsValue = (coins: CoinWalletType): number => {
	const keys = Object.keys(coins);
	return keys.reduce((previousValue, currentValue) => {
		const coinType = parseInt(currentValue);

		if (!coinVariants.includes(coinType)) {
			return previousValue;
		}

		return previousValue + coinType * coins[coinType];
	}, 0);
};

export function calculateChanges(cents: number) {
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
