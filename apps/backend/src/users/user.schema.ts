import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { RolesEnum } from '@vending/types';
import { Wallet } from '@vending/utils';
import mongoose, { Document } from 'mongoose';
import { CoinWalletSchemaType } from 'src/types';

export type UserDocument = User & Document;

@Schema()
export class User {
	@Prop({ required: true })
	username: string;

	@Prop({ required: true, select: false })
	password: string;

	@Prop({ type: CoinWalletSchemaType, default: new Wallet().getBalanceInCoins() })
	deposit: CoinWalletSchemaType;

	@Prop({ enum: Object.values(RolesEnum), default: RolesEnum.BUYER })
	role: RolesEnum;

	@Prop()
	session: string;
}

export interface CleanUser extends Omit<User, 'password'> {
	_id: mongoose.Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
