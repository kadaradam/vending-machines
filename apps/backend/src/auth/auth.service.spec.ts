import { JwtModule, JwtService } from '@nestjs/jwt';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import * as bcrypt from 'bcrypt';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connect, Connection, Model } from 'mongoose';
import { User, UserSchema } from 'src/users/user.schema';
import { UserExistsException } from 'test/exceptions';
import { UserDTOStub } from 'test/stubs';
import { AuthService } from './auth.service';

const JWT_SECRET = 'example';

UserSchema.pre('save', async function (next) {
	console.log('asd', this);
	// eslint-disable-next-line @typescript-eslint/no-this-alias
	const user = this;

	// only hash the password if it has been modified (or is new)
	if (!user.isModified('password')) return next();

	const hashedPassword = await bcrypt.hash(user.password, 8);

	user.password = hashedPassword;

	next();
});

describe('AuthService', () => {
	let service: AuthService;
	let jwtService: JwtService;
	let mongod: MongoMemoryServer;
	let mongoConnection: Connection;
	let userModel: Model<User>;

	beforeAll(async () => {
		mongod = await MongoMemoryServer.create();
		const uri = mongod.getUri();
		mongoConnection = (await connect(uri)).connection;
		userModel = mongoConnection.model(User.name, UserSchema);

		const module: TestingModule = await Test.createTestingModule({
			imports: [
				JwtModule.register({
					secretOrPrivateKey: JWT_SECRET,
					signOptions: {
						expiresIn: 3600,
					},
				}),
			],
			providers: [
				AuthService,
				{
					provide: getModelToken(User.name),
					useValue: userModel,
				},
			],
		}).compile();

		service = module.get<AuthService>(AuthService);
		jwtService = module.get<JwtService>(JwtService);
	});

	it('should be defined', () => {
		expect(service).toBeDefined();
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

	describe('userRegister', () => {
		it('should register a new user', async () => {
			const reigsterUsername = 'John Doe';
			const registerPassword = 'changeme';
			const registeredUser = await service.register({
				username: reigsterUsername,
				password: registerPassword,
			});

			const checkedUser = await userModel.findById(registeredUser._id).select('+password');

			expect(checkedUser.username).toBe(reigsterUsername);
			expect(await bcrypt.compare(registerPassword, checkedUser.password)).toBe(true);
		});

		it('should throw an already registered user error', async () => {
			const withUser = UserDTOStub();
			await new userModel({
				...withUser,
				password: 'changeme',
			}).save();

			await expect(
				service.register({
					username: withUser.username,
					password: 'changeme',
				}),
			).rejects.toThrow(new UserExistsException());
		});
	});

	describe('loginUser', () => {
		it('should log in successfully', async () => {
			const loginPassword = 'changeme';
			const withUser = UserDTOStub();
			await new userModel({
				...withUser,
				password: loginPassword,
			}).save();

			const validatedUser: any = await service.validateUser(withUser.username, loginPassword);
			expect(validatedUser.password).toBeUndefined();
			expect(validatedUser.username).toBe(withUser.username);

			const result = await service.login(validatedUser);
			const decodedJwt: any = jwtService.decode(result.access_token);

			expect(decodedJwt.sub).toBe(withUser._id.toString());
			expect(decodedJwt.username).toBe(withUser.username);
		});

		it('should fail to log in: invalid password', async () => {
			const withUser = UserDTOStub();
			await new userModel({
				...withUser,
				password: 'changeme',
			}).save();

			const validatedUser: any = await service.validateUser(withUser.username, 'changeme_pw');
			expect(validatedUser).toBeNull();
		});
	});
});
