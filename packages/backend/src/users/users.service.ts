import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CoinWalletType, ObjectNumberOnly } from '@vending/types';
import { sumObjectsByKey, Wallet } from '@vending/utils';
import { Model } from 'mongoose';
import { Product, ProductDocument } from 'src/products/products.schema';
import { UpdateUserDto } from './dto';
import { DepositAmountDto } from './dto/deposit-amount.dto';
import { CleanUser, User, UserDocument } from './user.schema';

type CleanUserKeys = keyof CleanUser;

@Injectable()
export class UsersService {
	constructor(
		@InjectModel(User.name) private userModel: Model<UserDocument>,
		@InjectModel(Product.name) private productModel: Model<ProductDocument>,
	) {}

	async getMyProfile(user: CleanUser): Promise<CleanUser> {
		return this.userModel.findById(user._id).exec();
	}

	async updateMyProfile(user: CleanUser, updateUserDto: UpdateUserDto): Promise<CleanUser> {
		// Class validator should catch not supported properties
		// Extra validation in case of malfunctioning
		const allowedPropsToUpdate: CleanUserKeys[] = ['username'];

		const isUpdateAllowed = Object.keys(updateUserDto).every((prop) =>
			allowedPropsToUpdate.includes(prop as CleanUserKeys),
		);

		if (!isUpdateAllowed) {
			throw new HttpException('Invalid properties to update', HttpStatus.METHOD_NOT_ALLOWED);
		}

		if (Object.keys(updateUserDto).includes)
			return this.userModel.findByIdAndUpdate(user._id, updateUserDto).exec();
	}

	async deleteMyProfile(user: CleanUser): Promise<CleanUser> {
		return this.userModel.findByIdAndDelete(user._id).exec();
	}

	async depositAmount(user: CleanUser, depositAmountDto: DepositAmountDto) {
		const userWallet = new Wallet(user.deposit as unknown as CoinWalletType);
		userWallet.addCoins(depositAmountDto.coins);

		return this.userModel
			.findByIdAndUpdate(user._id, { $set: { deposit: userWallet.getBalanceInCoins() } })
			.exec();
	}

	async resetDeposit(user: CleanUser) {
		return this.userModel.findByIdAndUpdate(user._id, { deposit: 0 }).exec();
	}

	async getSellerOverallBalance(user: CleanUser) {
		const userProducts = await this.productModel.find({ sellerId: user._id }).exec();

		const productBalanceMap = userProducts.map((product) => product.amountAvailable);
		const combinedBalance = sumObjectsByKey(
			...(productBalanceMap as unknown as ObjectNumberOnly[]),
		);

		return combinedBalance;
	}
}
