import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { CleanUser, User, UserDocument } from 'src/users/user.schema';

@Injectable()
export class AuthService {
	constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

	async validateUser(username: string, password: string): Promise<CleanUser> {
		const user = await this.userModel
			.findOne({
				username,
			})
			.select('+password')
			.exec();

		if (!user) {
			return null;
		}

		if (!(await bcrypt.compare(password, user.password))) {
			return null;
		}

		const { password: _, ...result } = user.toObject();

		// Because toObject() breaks the types
		// eslint-disable-next-line @typescript-eslint/ban-ts-comment
		// @ts-ignore
		return result;
	}
}
