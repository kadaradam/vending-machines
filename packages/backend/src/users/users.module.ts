import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { Document } from 'mongoose';
import { User, UserSchema } from './user.schema';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
	imports: [
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
	providers: [UsersService],
	controllers: [UsersController],
})
export class UsersModule {}
