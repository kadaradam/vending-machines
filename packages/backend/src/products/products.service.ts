import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CleanUser } from 'src/users/user.schema';
import { BuyProductDto, CreateProductDto, UpdateProductDto } from './dto';
import { Product, ProductDocument } from './products.schema';
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

	async findAll(user: CleanUser): Promise<Product[]> {
		return this.productModel.find({ sellerId: user._id }).exec();
	}

	async browseAll(): Promise<Product[]> {
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
		return this.productModel.findOneAndUpdate(
			{ _id: id, sellerId: user._id },
			updateProductDto,
		);
	}

	async delete(user: CleanUser, id: string): Promise<Product> {
		return this.productModel.findOneAndRemove({ _id: id, sellerId: user._id });
	}
}
