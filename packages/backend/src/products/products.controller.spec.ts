import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model } from 'mongoose';
import { User, UserSchema } from 'src/users/user.schema';
import { ProductsController } from './products.controller';
import { Product, ProductSchema } from './products.schema';
import { ProductsService } from './products.service';

describe('ProductsController', () => {
	let controller: ProductsController;
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
			controllers: [ProductsController],
		}).compile();

		controller = module.get<ProductsController>(ProductsController);
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
		expect(controller).toBeDefined();
	});
});
