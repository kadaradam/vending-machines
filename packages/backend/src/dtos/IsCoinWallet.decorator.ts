import { CoinWalletType } from '@vending/types';
import { coinVariants } from '@vending/utils';
import { registerDecorator, ValidationOptions } from 'class-validator';

const isObject = (variable: object) =>
	typeof variable === 'object' && !Array.isArray(variable) && variable !== null;

export function IsCoinWallet(validationOptions?: ValidationOptions) {
	return (object: any, propertyName: string) => {
		registerDecorator({
			name: 'IsCoinWallet',
			target: object.constructor,
			propertyName,
			constraints: [],
			options: validationOptions,
			validator: {
				validate(value: CoinWalletType) {
					return (
						isObject(value) &&
						Object.keys(value).every((coinType) =>
							coinVariants.includes(parseInt(coinType)),
						)
					);
				},
			},
		});
	};
}
