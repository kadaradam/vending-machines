import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { CoinWalletType } from 'src/types';

export type UserDocument = User & Document;

// move to lib
export enum RolesEnum {
	BUYER = 'BUYER',
	SELLER = 'SELLER',
}

@Schema()
export class User {
	@Prop({ required: true })
	username: string;

	@Prop({ required: true, select: false })
	password: string;

	@Prop({ type: CoinWalletType, default: {} })
	deposit: CoinWalletType;

	@Prop({ enum: Object.values(RolesEnum), default: RolesEnum.BUYER })
	role: RolesEnum;
}

export interface CleanUser extends Omit<User, 'password'> {
	_id: mongoose.Types.ObjectId;
}

export const UserSchema = SchemaFactory.createForClass(User);
