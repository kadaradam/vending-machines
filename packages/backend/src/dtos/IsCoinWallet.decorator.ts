import { registerDecorator, ValidationOptions } from 'class-validator';
import { CoinWalletType } from 'src/types';
import { coinVariants } from 'src/utils';

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
