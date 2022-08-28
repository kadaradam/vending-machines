import { HttpException, HttpStatus } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { RolesEnum } from '@vending/types/src';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { connect, Connection, Model } from 'mongoose';
import { CleanUser, User, UserSchema } from 'src/users/user.schema';
import { Product, ProductSchema } from './products.schema';
import { ProductsService } from './products.service';

const CleanUserDTOStub = (): CleanUser => {
	return {
		session: '-',
		_id: new mongoose.Types.ObjectId('630bd1f86d320d062f172244'),
		deposit: { 100: 0, 50: 0, 20: 0, 10: 0, 5: 0 },
		role: RolesEnum.BUYER,
		username: 'John Doe',
	};
};

const CreateProductDTOStub = (): Pick<Product, 'productName' | 'cost'> => {
	return {
		cost: 200,
		productName: 'Cola',
	};
};

class ProductAlreadyExists extends HttpException {
	constructor() {
		super('Product already exists', HttpStatus.CONFLICT);
	}
}

describe('ProductsService', () => {
	let service: ProductsService;
	let mongod: MongoMemoryServer;
	let mongoConnection: Connection;
	let userModel: Model<User>;
	let productModel: Model<Product>;

	beforeAll(async () => {
		mongod = await MongoMemoryServer.create();
		const uri = mongod.getUri();
		mongoConnection = (await connect(uri)).connection;
		userModel = mongoConnection.model(User.name, UserSchema);
		productModel = mongoConnection.model(Product.name, ProductSchema);

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				ProductsService,
				{
					provide: getModelToken(Product.name),
					useValue: productModel,
				},
				{
					provide: getModelToken(User.name),
					useValue: userModel,
				},
			],
		}).compile();

		service = module.get<ProductsService>(ProductsService);
	});

	afterAll(async () => {
		await mongoConnection.dropDatabase();
		await mongoConnection.close();
		await mongod.stop();
	});

	afterEach(async () => {
		const collections = mongoConnection.collections;
		for (const key in collections) {
			const collection = collections[key];
			await collection.deleteMany({});
		}
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
	});

	describe('addProduct', () => {
		it('should create new product', async () => {
			const withUser = CleanUserDTOStub();
			const toCreateProduct = CreateProductDTOStub();
			const product = await service.create(withUser, toCreateProduct);

			expect(product.productName).toBe(toCreateProduct.productName);
			expect(product.cost).toBe(toCreateProduct.cost);
			expect(product.sellerId).toBe(withUser._id);
		});

		it('should create new product and throw exist error', async () => {
			const withUser = CleanUserDTOStub();
			const toCreateProduct = CreateProductDTOStub();

			await expect(service.create(withUser, toCreateProduct)).rejects.toThrow(
				new ProductAlreadyExists(),
			);
		});
	});
});
