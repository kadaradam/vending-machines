import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';
import { UsersService } from './users/users.service';

@Module({
	imports: [
		MongooseModule.forRootAsync({
			useFactory: () => ({
				uri: 'mongodb://localhost/vending',
			}),
		}),
		UsersModule,
		ProductsModule,
		AuthModule,
	],
	controllers: [AppController],
	providers: [AppService, UsersService],
})
export class AppModule {}
