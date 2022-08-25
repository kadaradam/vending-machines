import { IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
	@IsString()
	productName: string;

	@IsNumber()
	cost: number;
}
