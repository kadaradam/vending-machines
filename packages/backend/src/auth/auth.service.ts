import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Model } from 'mongoose';
import { CleanUser, User, UserDocument } from 'src/users/user.schema';
import { RegisterDto } from './dto';

@Injectable()
export class AuthService {
	constructor(
		@InjectModel(User.name) private userModel: Model<UserDocument>,
		private jwtService: JwtService,
	) {}

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

		const { password: _, ...response } = user.toObject<User>();

		return response;
	}

	async login(user: CleanUser) {
		const payload = { username: user.username, sub: user._id };
		return {
			access_token: this.jwtService.sign(payload),
		};
	}

	async register(registerDto: RegisterDto): Promise<CleanUser> {
		const user = await this.userModel.findOne({ username: registerDto.username });

		if (user) {
			throw new HttpException('User already exists', HttpStatus.CONFLICT);
		}

		const createdUser = new this.userModel({
			...registerDto,
		});

		const saveResult = await createdUser.save();

		const { password: _, ...response } = saveResult.toObject<User>();

		return response;
	}
}
