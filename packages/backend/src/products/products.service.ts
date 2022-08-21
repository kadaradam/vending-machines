import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CleanUser } from 'src/users/user.schema';
import { BuyProductDto, CreateProductDto, UpdateProductDto } from './dto';
import { Product, ProductDocument } from './products.schema';

type ProductKeys = keyof Product;

@Injectable()
export class ProductsService {
	constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}

	async buyProducts(user: CleanUser, id: string, buyProductDto: BuyProductDto) {
		return true;
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
