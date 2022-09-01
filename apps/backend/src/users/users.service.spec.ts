import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { RolesEnum } from '@vending/types/src';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { connect, Connection, Model } from 'mongoose';
import { Product, ProductSchema } from 'src/products/products.schema';
import { CleanUser, User, UserSchema } from 'src/users/user.schema';
import { UsersService } from './users.service';

const UserDTOStub = (
	{ deposit, role }: Pick<CleanUser, 'deposit' | 'role'> = {
		deposit: { 100: 0, 50: 0, 20: 0, 10: 0, 5: 0 },
		role: RolesEnum.BUYER,
	},
): CleanUser => {
	return {
		session: '-',
		_id: new mongoose.Types.ObjectId('630bd1f86d320d062f172244'),
		deposit,
		role,
		username: 'John Doe',
	};
};

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
});
