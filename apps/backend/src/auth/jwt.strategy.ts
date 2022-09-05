import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CleanUser, User, UserDocument } from 'src/users/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(
		@InjectModel(User.name) private userModel: Model<UserDocument>,
		readonly configService: ConfigService,
	) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			secretOrKey: configService.get<string>('JWT_SECRET'),
		});
	}

	async validate(payload: any): Promise<CleanUser> {
		const user = await this.userModel.findById(payload.sub).select('+session');

		if (!user) {
			throw new HttpException('User not found', HttpStatus.NOT_FOUND);
		}

		if (user.session !== payload.session) {
			throw new HttpException(
				'There is already an active session using your account',
				HttpStatus.UNAUTHORIZED,
			);
		}

		return user;
	}
}
