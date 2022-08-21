import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { CoinWalletSchemaType } from 'src/types';
import { User } from 'src/users/user.schema';
import { getEmptyWallet } from 'src/utils';

export type ProductDocument = Product & Document;

@Schema()
export class Product {
	@Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: User.name })
	sellerId: User;

	@Prop({ required: true })
	productName: string;

	@Prop({ type: CoinWalletSchemaType, default: getEmptyWallet() })
	amountAvailable: CoinWalletSchemaType;

	@Prop({ default: 0 })
	cost: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);
