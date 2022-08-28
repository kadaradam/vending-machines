import { CoinWalletType } from '@vending/types';
import { IsNotEmptyObject, IsNumber, IsObject } from 'class-validator';
import { IsCoinWallet } from 'src/dtos';

export class BuyProductDto {
	@IsNotEmptyObject()
	@IsObject()
	@IsCoinWallet()
	coins: CoinWalletType;

	@IsNumber()
	quantity: number;
}
