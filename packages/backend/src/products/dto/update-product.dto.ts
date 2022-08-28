import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateProductDto {
	@IsOptional()
	@IsString()
	productName?: string;

	@IsOptional()
	@IsNumber()
	cost?: number;
}
