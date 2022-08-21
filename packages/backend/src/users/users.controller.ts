import { Body, Controller, Delete, Get, Post, Put, Request } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { RegisterDto } from 'src/auth/dto';
import { UserRequestType } from 'src/types';
import { UpdateUserDto } from './dto';
import { DepositAmountDto } from './dto/deposit-amount.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	constructor(
		private readonly usersService: UsersService,
		private readonly authService: AuthService,
	) {}

	// Same as /auth/register route
	@Post()
	async create(@Body() registerUserDto: RegisterDto) {
		return this.authService.register(registerUserDto);
	}

	@Get(':id')
	async find(@Request() req: UserRequestType) {
		return this.usersService.findOne(req.user);
	}

	@Put(':id')
	async update(@Request() req: UserRequestType, @Body() updateUserDto: UpdateUserDto) {
		return this.usersService.update(req.user, updateUserDto);
	}

	@Delete(':id')
	async delete(@Request() req: UserRequestType) {
		return this.usersService.delete(req.user);
	}

	@Put('/deposit')
	async deposit(@Request() req: UserRequestType, @Body() depositAmountDto: DepositAmountDto) {
		// TODO: add check: only buyer
		return this.usersService.depositAmount(req.user, depositAmountDto);
	}

	@Post('/reset')
	async reset(@Request() req: UserRequestType) {
		// TODO: add check: only buyer
		return this.usersService.resetDeposit(req.user);
	}

	// Admin functions
}
