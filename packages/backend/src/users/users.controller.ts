import { Body, Controller, Delete, Get, Post, Put, Request, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { RegisterDto } from 'src/auth/dto';
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRequestType } from 'src/types';
import { UpdateUserDto } from './dto';
import { DepositAmountDto } from './dto/deposit-amount.dto';
import { RolesEnum } from './user.schema';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	constructor(
		private readonly usersService: UsersService,
		private readonly authService: AuthService,
	) {}

	@UseGuards(RolesGuard)
	@Roles(RolesEnum.BUYER)
	@Put('/deposit')
	async deposit(@Request() req: UserRequestType, @Body() depositAmountDto: DepositAmountDto) {
		return this.usersService.depositAmount(req.user, depositAmountDto);
	}

	@UseGuards(RolesGuard)
	@Roles(RolesEnum.BUYER)
	@Post('/reset')
	async reset(@Request() req: UserRequestType) {
		return this.usersService.resetDeposit(req.user);
	}

	@UseGuards(RolesGuard)
	@Roles(RolesEnum.SELLER)
	@Get('/all-balance')
	async getSellerOverallBalance(@Request() req: UserRequestType) {
		return this.usersService.getSellerOverallBalance(req.user);
	}

	// Alias: Same as /auth/register route
	@Post()
	async create(@Body() registerUserDto: RegisterDto) {
		return this.authService.register(registerUserDto);
	}

	@Get()
	async myProfile(@Request() req: UserRequestType) {
		return this.usersService.findOne(req.user);
	}

	@Put()
	async updateMyProfile(@Request() req: UserRequestType, @Body() updateUserDto: UpdateUserDto) {
		return this.usersService.update(req.user, updateUserDto);
	}

	@Delete()
	async deleteMyProfile(@Request() req: UserRequestType) {
		return this.usersService.delete(req.user);
	}
}
