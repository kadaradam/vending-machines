import { IsNumber, IsString } from 'class-validator';

export class UpdateProductDto {
	@IsString()
	productName: string;

	@IsNumber()
	amountAvailable: number;
}
