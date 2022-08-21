import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UpdateUserDto } from './dto';
import { DepositAmountDto } from './dto/deposit-amount.dto';
import { CleanUser, User, UserDocument } from './user.schema';

type CleanUserKeys = keyof CleanUser;

@Injectable()
export class UsersService {
	constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

	async findOne(user: CleanUser): Promise<CleanUser> {
		return this.userModel.findById(user._id).exec();
	}

	async update(user: CleanUser, updateUserDto: UpdateUserDto): Promise<CleanUser> {
		// Class validator should catch not supported properties
		// Extra validation in case of malfunctioning
		const allowedPropsToUpdate: CleanUserKeys[] = ['deposit', 'role'];

		const isUpdateAllowed = Object.keys(updateUserDto).every((prop) =>
			allowedPropsToUpdate.includes(prop as CleanUserKeys),
		);

		if (!isUpdateAllowed) {
			throw new HttpException('Invalid properties to update', HttpStatus.METHOD_NOT_ALLOWED);
		}

		if (Object.keys(updateUserDto).includes)
			return this.userModel.findByIdAndUpdate(user._id, updateUserDto).exec();
	}

	async delete(user: CleanUser): Promise<CleanUser> {
		return this.userModel.findByIdAndDelete(user._id).exec();
	}

	async depositAmount(user: CleanUser, depositAmountDto: DepositAmountDto) {
		return this.userModel
			.findByIdAndUpdate(user._id, { $inc: { deposit: depositAmountDto.amount } })
			.exec();
	}

	async resetDeposit(user: CleanUser) {
		return this.userModel.findByIdAndUpdate(user._id, { deposit: 0 }).exec();
	}
}
