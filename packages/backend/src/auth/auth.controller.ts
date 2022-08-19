import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { UserRequestType } from 'src/types';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';
import { Public } from './public.metadata';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Public()
	@UseGuards(LocalAuthGuard)
	@Post('login')
	async login(@Request() req: UserRequestType) {
		return this.authService.login(req.user);
	}
}
