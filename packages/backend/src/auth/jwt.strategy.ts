import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
	constructor() {
		super({
			jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
			ignoreExpiration: false,
			// TODO: add to env config
			secretOrKey: '9Y!3q$80D2^T',
		});
	}

	async validate(payload: any) {
		return { userId: payload.sub, username: payload.username };
	}
}
