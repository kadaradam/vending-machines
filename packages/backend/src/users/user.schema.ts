import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { RolesEnum } from '@vending/types';
import mongoose, { Document } from 'mongoose';
import { CoinWalletSchemaType } from 'src/types';
import { getEmptyWallet } from 'src/utils';

export type UserDocument = User & Document;

@Schema()
export class User {
	@Prop({ required: true })
	username: string;

	@Prop({ required: true, select: false })
	password: string;

	@Prop({ type: CoinWalletSchemaType, default: getEmptyWallet() })
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
