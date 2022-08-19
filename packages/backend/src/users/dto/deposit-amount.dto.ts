import { IsIn, IsNumber } from 'class-validator';

export class DepositAmountDto {
	@IsNumber()
	@IsIn([5, 10, 20, 50, 100])
	amount: number;
}
