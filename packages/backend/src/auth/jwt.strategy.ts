import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { PassportStrategy } from '@nestjs/passport';
import { Model } from 'mongoose';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CleanUser, User, UserDocument } from 'src/users/user.schema';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			// TODO: add to env config
			secretOrKey: '9Y!3q$80D2^T',
		});
	}

	async validate(payload: any): Promise<CleanUser> {
		return this.userModel.findById(payload.sub).exec();
	}
}
