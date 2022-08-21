import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Document } from 'mongoose';
import { AuthService } from 'src/auth/auth.service';
import { User, UserSchema } from './user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
	imports: [
		JwtModule.registerAsync({
			imports: [ConfigModule],
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => ({
				secret: configService.get<string>('JWT_SECRET'),
				signOptions: { expiresIn: '7d' },
			}),
		}),
		MongooseModule.forFeatureAsync([
			{
				name: User.name,
				useFactory: () => {
					const schema = UserSchema;
					schema.pre<User & Document>('save', async function (next) {
						// eslint-disable-next-line @typescript-eslint/no-this-alias
						const user = this;

						// only hash the password if it has been modified (or is new)
						if (!user.isModified('password')) return next();

						const hashedPassword = await bcrypt.hash(user.password, 8);

						user.password = hashedPassword;

						next();
					});

					return schema;
				},
			},
		]),
	],
	providers: [UsersService, AuthService],
	controllers: [UsersController],
})
export class UsersModule {}
