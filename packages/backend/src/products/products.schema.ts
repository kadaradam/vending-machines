import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { CoinWalletType } from 'src/types';
import { User } from 'src/users/user.schema';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
	@Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: User.name })
	sellerId: User;

	@Prop({ required: true })
	productName: string;

	@Prop({ type: CoinWalletType, default: {} })
	amountAvailable: CoinWalletType;

	@Prop({ default: 0 })
	cost: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
