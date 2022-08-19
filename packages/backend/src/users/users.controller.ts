import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserRequestType } from 'src/types';
import { CreateUserDto, UpdateUserDto } from './dto';
import { DepositAmountDto } from './dto/deposit-amount.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Post('/deposit')
	async deposit(req: UserRequestType, @Body() depositAmountDto: DepositAmountDto) {
		return this.usersService.depositAmount(req.user, depositAmountDto);
	}

	// CRUD
	@Get()
	async get() {
		return this.usersService.findAll();
	}

	@Get(':id')
	async find(@Param('id') id: string) {
		return this.usersService.findOne(id);
	}

	@Post()
	async create(@Body() createUserDto: CreateUserDto) {
		return this.usersService.create(createUserDto);
	}

	@Put(':id')
	async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
		return this.usersService.update(id, updateUserDto);
	}

	@Delete(':id')
	async delete(@Param('id') id: string) {
		return this.usersService.delete(id);
	}
}
