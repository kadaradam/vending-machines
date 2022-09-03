import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { RolesEnum } from '@vending/types/src';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { connect, Connection, Model } from 'mongoose';
import { Product, ProductSchema } from 'src/products/products.schema';
import { User, UserSchema } from 'src/users/user.schema';
import { UserDTOStub } from 'test/stubs';
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

	//
	// See createUser (register) in the auth.service.spec.ts file
	//

	describe('getUser', () => {
		it("should get the user's profile", async () => {
			const withUser = UserDTOStub();

			await new userModel({
				...withUser,
				password: 'test',
			}).save();

			const user = await service.getMyProfile(withUser);

			expect(user._id).toStrictEqual(withUser._id);
			expect(user.deposit).toMatchObject(withUser.deposit);
			expect(user.role).toBe(withUser.role);
			expect(user.session).toBe(withUser.session);
			expect(user.username).toBe(withUser.username);
		});
	});

	describe('updateUser', () => {
		it("should update the user's username", async () => {
			const withUser = UserDTOStub();

			await new userModel({
				...withUser,
				password: 'test',
			}).save();

			const newUsername = 'Mike Tyson';

			await service.updateMyProfile(withUser, { username: newUsername });
			const updatedUser = await userModel.findById(withUser._id);

			expect(updatedUser.username).toBe(newUsername);
		});
	});

	describe('deleteUser', () => {
		it("should delete the user's profile", async () => {
			const withUser = UserDTOStub();

			await new userModel({
				...withUser,
				password: 'test',
			}).save();

			await service.deleteMyProfile(withUser);
			const deletedUser = await userModel.findById(withUser._id);

			expect(deletedUser).toBe(null);
		});
	});

	describe('depositAmount / BUYER', () => {
		it("should deposit 250 into the user's balance", async () => {
			// User has 105 balance initially
			const withUser = UserDTOStub({
				deposit: { 100: 1, 50: 0, 20: 0, 10: 0, 5: 1 },
				role: RolesEnum.BUYER,
			});

			await new userModel({
				...withUser,
				password: 'test',
			}).save();

			await service.depositAmount(withUser, {
				coins: { 100: 0, 50: 2, 20: 2, 10: 1, 5: 20 },
			});
			const updatedUser = await userModel.findById(withUser._id);

			expect(updatedUser.deposit).toMatchObject({ 100: 1, 50: 2, 20: 2, 10: 1, 5: 21 });
		});
	});

	describe('resetBalance / BUYER', () => {
		it("should deposit 250 into the user's balance", async () => {
			const withUser = UserDTOStub({
				deposit: { 100: 3, 50: 10, 20: 20, 10: 0, 5: 1 },
				role: RolesEnum.BUYER,
			});

			await new userModel({
				...withUser,
				password: 'test',
			}).save();

			await service.resetDeposit(withUser);
			const updatedUser = await userModel.findById(withUser._id);

			expect(updatedUser.deposit).toMatchObject({ 100: 0, 50: 0, 20: 0, 10: 0, 5: 0 });
		});
	});

	describe('getSellerBalance / SELLER', () => {
		it("should deposit 250 into the user's balance", async () => {
			const withUser = UserDTOStub({
				deposit: { 100: 0, 50: 0, 20: 0, 10: 0, 5: 0 },
				role: RolesEnum.SELLER,
			});

			await Promise.all([
				new userModel({
					...withUser,
					password: 'test',
				}).save(),
				new productModel({
					sellerId: withUser._id,
					productName: 'Fanta',
					cost: 100,
					amountAvailable: { 100: 1, 50: 1, 20: 2, 10: 0, 5: 9 },
				}).save(),
				new productModel({
					sellerId: withUser._id,
					productName: 'Cola',
					cost: 100,
					amountAvailable: { 100: 0, 50: 0, 20: 5, 10: 7, 5: 4 },
				}).save(),
				new productModel({
					sellerId: new mongoose.Types.ObjectId(),
					productName: 'Gold',
					cost: 100,
					amountAvailable: { 100: 10, 50: 5, 20: 50, 10: 5, 5: 15 },
				}).save(),
				new productModel({
					sellerId: withUser._id,
					productName: 'Sprite',
					cost: 100,
					amountAvailable: { 100: 5, 50: 1, 20: 1, 10: 2, 5: 2 },
				}).save(),
			]);

			const totalBalance = await service.getSellerTotalBalance(withUser);

			expect(totalBalance).toMatchObject({ 100: 6, 50: 2, 20: 8, 10: 9, 5: 15 });
		});
	});
});
