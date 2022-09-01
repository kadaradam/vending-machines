import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model } from 'mongoose';
import { Product, ProductSchema } from 'src/products/products.schema';
import { User, UserSchema } from 'src/users/user.schema';
import { UsersService } from './users.service';

describe('UsersService', () => {
	let service: UsersService;
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
				UsersService,
				{
					provide: getModelToken(User.name),
					useValue: userModel,
				},
				{
					provide: getModelToken(Product.name),
					useValue: productModel,
				},
			],
		}).compile();

		service = module.get<UsersService>(UsersService);
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
});
