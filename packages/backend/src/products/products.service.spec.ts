import { HttpException, HttpStatus } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { CoinWalletType, RolesEnum } from '@vending/types/src';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { connect, Connection, Model } from 'mongoose';
import { CleanUser, User, UserSchema } from 'src/users/user.schema';
import { Product, ProductSchema } from './products.schema';
import { ProductsService } from './products.service';

const CleanUserDTOStub = (
	{ deposit }: Pick<CleanUser, 'deposit'> = { deposit: { 100: 0, 50: 0, 20: 0, 10: 0, 5: 0 } },
): CleanUser => {
	return {
		session: '-',
		_id: new mongoose.Types.ObjectId('630bd1f86d320d062f172244'),
		deposit: deposit,
		role: RolesEnum.BUYER,
		username: 'John Doe',
	};
};

const CreateProductDTOStub = (
	{ cost }: Pick<Product, 'cost'> = { cost: 200 },
): Pick<Product, 'productName' | 'cost'> => {
	return {
		cost,
		productName: 'Cola',
	};
};

class ProductAlreadyExists extends HttpException {
	constructor() {
		super('Product already exists', HttpStatus.CONFLICT);
	}
}

class NoChangeInMachine extends HttpException {
	constructor() {
		super('Not enough changes in the machine', HttpStatus.CONFLICT);
	}
}

class NonExistentCoins extends HttpException {
	constructor() {
		super('Coins does not exists', HttpStatus.CONFLICT);
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

			await new productModel({ ...toCreateProduct, sellerId: withUser._id }).save();

			await expect(service.create(withUser, toCreateProduct)).rejects.toThrow(
				new ProductAlreadyExists(),
			);
		});
	});

	describe('getProduct', () => {
		it('should get created product', async () => {
			const withUser = CleanUserDTOStub();
			const toGetProduct = CreateProductDTOStub();
			const createdProduct = await new productModel({
				...toGetProduct,
				sellerId: withUser._id,
			}).save();

			const product = await service.findOne(withUser, createdProduct._id.toString());

			expect(product.productName).toBe(toGetProduct.productName);
			expect(product.cost).toBe(toGetProduct.cost);
			expect(product.sellerId.toString()).toBe(withUser._id.toString());
		});

		it('should get a not existing product', async () => {
			const withUser = CleanUserDTOStub();

			const product = await service.findOne(withUser, '630be4a3ec6c4cf54a04c894');

			expect(product).toBe(null);
		});
	});

	describe('updateProduct', () => {
		it('should update a product', async () => {
			const withUser = CleanUserDTOStub();
			const toGetProduct = CreateProductDTOStub();
			const createdProduct = await new productModel({
				...toGetProduct,
				sellerId: withUser._id,
			}).save();

			const newProductName = 'Fanta';

			await service.update(withUser, createdProduct._id.toString(), {
				productName: newProductName,
			});

			const updatedProduct = await productModel.findById(createdProduct._id);

			expect(updatedProduct.productName).toBe(newProductName);
		});
	});

	describe('deleteProduct', () => {
		it('should delete a product', async () => {
			const withUser = CleanUserDTOStub();
			const toGetProduct = CreateProductDTOStub();
			const createdProduct = await new productModel({
				...toGetProduct,
				sellerId: withUser._id,
			}).save();

			await service.delete(withUser, createdProduct._id.toString());

			const updatedProduct = await productModel.findById(createdProduct._id);

			expect(updatedProduct).toBe(null);
		});
	});

	describe('buyProduct', () => {
		it('should successfully buy a product with no change', async () => {
			const withUser = CleanUserDTOStub({ deposit: { 100: 1, 50: 2, 20: 0, 10: 0, 5: 0 } });
			const toGetProduct = CreateProductDTOStub();

			await new userModel({ ...withUser, password: 'test' }).save();
			const createdProduct = await new productModel({
				...toGetProduct,
				sellerId: withUser._id,
			}).save();

			const quantityToBuy = 1;
			await service.buyProducts(withUser, createdProduct._id.toString(), {
				coins: withUser.deposit as unknown as CoinWalletType,
				quantity: quantityToBuy,
			});

			const boughtProduct = await productModel.findById(createdProduct._id);
			const user = await userModel.findById(withUser._id);

			expect(boughtProduct.amountAvailable).toMatchObject({
				100: 1,
				50: 2,
				20: 0,
				10: 0,
				5: 0,
			});
			expect(user.deposit).toMatchObject({ 100: 0, 50: 0, 20: 0, 10: 0, 5: 0 });

			/* expect(buyResult.changes).toStrictEqual({});
			expect(buyResult.productId).toStrictEqual(createdProduct._id);
			expect(buyResult.productName).toBe(createdProduct.productName);
			expect(buyResult.quantity).toBe(quantityToBuy);
			expect(buyResult.spent).toBe(quantityToBuy * createdProduct.cost);
			expect(buyResult.spentInCoins).toBe(withUser.deposit); */
		});

		it('should successfully buy a product with 100 change back (user overpaid)', async () => {
			// Initially user has 450 balance
			const withUser = CleanUserDTOStub({ deposit: { 100: 2, 50: 2, 20: 2, 10: 1, 5: 20 } });
			const toGetProduct = CreateProductDTOStub();
			const quantityToBuy = 1;

			await new userModel({ ...withUser, password: 'test' }).save();
			const createdProduct = await new productModel({
				...toGetProduct,
				sellerId: withUser._id,
			}).save();

			// User inserts 250 balance
			await service.buyProducts(withUser, createdProduct._id.toString(), {
				coins: { 100: 0, 50: 2, 20: 2, 10: 1, 5: 20 },
				quantity: quantityToBuy,
			});

			const boughtProduct = await productModel.findById(createdProduct._id);
			const user = await userModel.findById(withUser._id);

			// Seller's balance: 200
			expect(boughtProduct.amountAvailable).toMatchObject({
				100: 0,
				50: 1,
				20: 2,
				10: 1,
				5: 20,
			});
			// User balance after purchase: 250
			expect(user.deposit).toMatchObject({ 100: 2, 50: 1, 20: 0, 10: 0, 5: 0 });
		});

		it('should successfully buy a product with 100 change back (from sellers balance)', async () => {
			// Initially user has 350 balance
			const withUser = CleanUserDTOStub({ deposit: { 100: 3, 50: 1, 20: 0, 10: 0, 5: 0 } });
			const toGetProduct = CreateProductDTOStub({ cost: 250 });
			const quantityToBuy = 1;

			// Initially seller has 65 balance
			await new userModel({ ...withUser, password: 'test' }).save();
			const createdProduct = await new productModel({
				...toGetProduct,
				amountAvailable: { 100: 0, 50: 0, 20: 2, 10: 2, 5: 1 },
				sellerId: withUser._id,
			}).save();

			// User inserts 300 balance
			await service.buyProducts(withUser, createdProduct._id.toString(), {
				coins: { 100: 3, 50: 0, 20: 0, 10: 0, 5: 0 },
				quantity: quantityToBuy,
			});

			const boughtProduct = await productModel.findById(createdProduct._id);
			const user = await userModel.findById(withUser._id);

			// Seller's balance: 65 + 250 = 315
			expect(boughtProduct.amountAvailable).toMatchObject({
				'5': 1,
				'10': 1,
				'20': 0,
				'50': 0,
				'100': 3,
			});
			// User balance after purchase: 300 - 250 = 50
			expect(user.deposit).toMatchObject({ '5': 0, '10': 1, '20': 2, '50': 1, '100': 0 });
		});

		it('should throw error when buy a product: no changes in the machine', async () => {
			// Initially user has 350 balance
			const withUser = CleanUserDTOStub({ deposit: { 100: 3, 50: 1, 20: 0, 10: 0, 5: 0 } });
			const toGetProduct = CreateProductDTOStub({ cost: 250 });
			const quantityToBuy = 1;

			await new userModel({ ...withUser, password: 'test' }).save();
			const createdProduct = await new productModel({
				...toGetProduct,
				sellerId: withUser._id,
			}).save();

			// User inserts 300 balance
			await expect(
				service.buyProducts(withUser, createdProduct._id.toString(), {
					coins: { 100: 3, 50: 0, 20: 0, 10: 0, 5: 0 },
					quantity: quantityToBuy,
				}),
			).rejects.toThrow(new NoChangeInMachine());
		});

		it('should throw error when buy a product: coins are not in users wallet', async () => {
			// Initially user has 450 balance
			const withUser = CleanUserDTOStub({ deposit: { 100: 0, 50: 6, 20: 2, 10: 1, 5: 20 } });
			const toGetProduct = CreateProductDTOStub();
			const quantityToBuy = 1;

			await new userModel({ ...withUser, password: 'test' }).save();
			const createdProduct = await new productModel({
				...toGetProduct,
				sellerId: withUser._id,
			}).save();

			// User inserts 250 balance
			await expect(
				service.buyProducts(withUser, createdProduct._id.toString(), {
					coins: { 100: 1, 50: 1, 20: 2, 10: 1, 5: 10 },
					quantity: quantityToBuy,
				}),
			).rejects.toThrow(new NonExistentCoins());
		});
	});
});
