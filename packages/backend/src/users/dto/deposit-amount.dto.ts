import { CoinWalletType } from '@vending/types';
import { IsNotEmptyObject, IsObject } from 'class-validator';
import { IsCoinWallet } from 'src/dtos';

export class DepositAmountDto {
	@IsNotEmptyObject()
	@IsObject()
	@IsCoinWallet()
	coins: CoinWalletType;
}
