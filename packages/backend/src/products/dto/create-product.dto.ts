import { Transform } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';
import mongoose from 'mongoose';

export class CreateProductDto {
	@Transform((id) => new mongoose.Types.ObjectId(id.value))
	sellerId: mongoose.Types.ObjectId;

	@IsString()
	productName: string;

	@IsNumber()
	amountAvailable: number;
}
