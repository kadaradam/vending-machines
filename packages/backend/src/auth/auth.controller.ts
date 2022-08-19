import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common';
import { UserRequestType } from 'src/types';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto';
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

	@Public()
	@Post('register')
	async register(@Body() registerUserDto: RegisterDto) {
		return this.authService.register(registerUserDto);
	}
}
