import { RolesEnum } from '@vending/types/src';
import mongoose from 'mongoose';
import { CoinWalletSchemaType } from 'src/types';
import { CleanUser } from 'src/users/user.schema';

type UserDTOStubArgs = {
	deposit: CoinWalletSchemaType;
	role?: RolesEnum;
};

export const UserDTOStub = (
	{ deposit, role = RolesEnum.BUYER }: UserDTOStubArgs = {
		deposit: { 100: 0, 50: 0, 20: 0, 10: 0, 5: 0 },
		role: RolesEnum.BUYER,
	},
): CleanUser => {
	return {
		session: '-',
		_id: new mongoose.Types.ObjectId('630bd1f86d320d062f172244'),
		deposit,
		role,
		username: 'John Doe',
	};
};
