import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto, UpdateUserDto } from './dto';
import { DepositAmountDto } from './dto/deposit-amount.dto';
import { CleanUser, User, UserDocument } from './user.schema';

@Injectable()
export class UsersService {
	constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

	async create(createUserDto: CreateUserDto): Promise<CleanUser> {
		const userExists = await this.userModel.findOne({ username: createUserDto.username });

		if (userExists) {
			throw new HttpException('User already exists', HttpStatus.CONFLICT);
		}

		const createdUser = new this.userModel({
			...createUserDto,
		});

		const saveResult = await createdUser.save();

		const { password: _, ...response } = saveResult.toObject<User>();

		return response;
	}

	async findAll(): Promise<CleanUser[]> {
		return this.userModel.find().exec();
	}

	async findOne(id: string): Promise<CleanUser> {
		return this.userModel.findById(id).exec();
	}

	async update(id: string, updateUserDto: UpdateUserDto): Promise<CleanUser> {
		return this.userModel.findByIdAndUpdate(id, updateUserDto).exec();
	}

	async delete(id: string): Promise<CleanUser> {
		return this.userModel.findByIdAndDelete(id).exec();
	}

	async depositAmount(user: CleanUser, depositAmountDto: DepositAmountDto) {
		return this.userModel
			.findByIdAndUpdate(user._id, { $inc: { deposit: depositAmountDto.amount } })
			.exec();
	}
}
