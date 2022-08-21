import { IsNotEmptyObject, IsObject } from 'class-validator';
import { IsCoinWallet } from 'src/dtos';
import { CoinWalletType } from 'src/types';

export class DepositAmountDto {
	@IsNotEmptyObject()
	@IsObject()
	@IsCoinWallet()
	coins: CoinWalletType;
}
