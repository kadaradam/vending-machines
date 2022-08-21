import { IsNotEmptyObject, IsNumber, IsObject } from 'class-validator';
import { IsCoinWallet } from 'src/dtos';
import { CoinWalletType } from 'src/types';

export class BuyProductDto {
	@IsNotEmptyObject()
	@IsObject()
	@IsCoinWallet()
	coins: CoinWalletType;

	@IsNumber()
	quantity: number;
}
