import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CoinWalletType } from 'src/types';
import { CleanUser } from 'src/users/user.schema';
import { Wallet } from 'src/utils';
import { BuyProductDto, CreateProductDto, UpdateProductDto } from './dto';
import { Product, ProductDocument } from './products.schema';

type ProductKeys = keyof Product;

@Injectable()
export class ProductsService {
	constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}

	async buyProducts(user: CleanUser, id: string, buyProductDto: BuyProductDto) {
		const product = await this.productModel.findById(id).exec();

		if (!product) {
			throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
		}

		const price = product.cost * buyProductDto.quantity;

		// TODO: fix type
		const userWallet = Wallet(user.deposit as unknown as CoinWalletType);
		const userBalance = userWallet.getBalance();

		if (!userWallet.checkContains(buyProductDto.coins)) {
			throw new HttpException('Coins does not exists', HttpStatus.CONFLICT);
		}

		if (Wallet(buyProductDto.coins).getBalance() < price) {
			throw new HttpException('Insufficient funds', HttpStatus.CONFLICT);
		}

		// Update product balance
		// TODO: fix type
		const productWallet = Wallet(product.amountAvailable as unknown as CoinWalletType);
		productWallet.addCoins(buyProductDto.coins);

		// Update user balance
		userWallet.removeCoins(buyProductDto.coins);

		const coinChangesInCent = Wallet(buyProductDto.coins).getBalance() - price;

		let coinChanges: CoinWalletType = {};

		if (coinChangesInCent > 0) {
			coinChanges = productWallet.getChange(coinChangesInCent);

			if (Object.keys(coinChanges).length <= 0) {
				throw new HttpException('Not enough changes in the machine', HttpStatus.CONFLICT);
			}

			userWallet.addCoins(coinChanges);
			productWallet.removeCoins(coinChanges);
		}

		console.log({ productWallet: productWallet.getBalance() });
		console.log({ userWallet: userWallet.getBalance() });

		return {
			spent: price,
			spentInCoins: buyProductDto.coins,
			changes: coinChanges,
			quantity: buyProductDto.quantity,
			productId: product._id,
			productName: product.productName,
		};
	}

	async create(user: CleanUser, createProductDto: CreateProductDto): Promise<Product> {
		const productExists = await this.productModel.findOne({
			productName: createProductDto.productName,
			sellerId: user._id,
		});

		if (productExists) {
			throw new HttpException('Product already exists', HttpStatus.CONFLICT);
		}

		const createdProduct = new this.productModel({
			productName: createProductDto.productName,
			sellerId: user._id,
		});

		return createdProduct.save();
	}

	async listProductsForSeller(user: CleanUser): Promise<Product[]> {
		return this.productModel.find({ sellerId: user._id }).exec();
	}

	async listProductsForBuyer(): Promise<Product[]> {
		return this.productModel.find().exec();
	}

	async findOne(user: CleanUser, id: string): Promise<Product> {
		return this.productModel.findOne({ _id: id, sellerId: user._id });
	}

	async update(
		user: CleanUser,
		id: string,
		updateProductDto: UpdateProductDto,
	): Promise<Product> {
		// Class validator should catch not supported properties
		// Extra validation in case of malfunctioning
		const allowedPropsToUpdate: ProductKeys[] = ['amountAvailable'];

		const isUpdateAllowed = Object.keys(updateProductDto).every((prop) =>
			allowedPropsToUpdate.includes(prop as ProductKeys),
		);

		if (!isUpdateAllowed) {
			throw new HttpException('Invalid properties to update', HttpStatus.METHOD_NOT_ALLOWED);
		}

		return this.productModel.findOneAndUpdate(
			{ _id: id, sellerId: user._id },
			updateProductDto,
		);
	}

	async delete(user: CleanUser, id: string): Promise<Product> {
		return this.productModel.findOneAndRemove({ _id: id, sellerId: user._id });
	}
}
