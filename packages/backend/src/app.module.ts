import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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
	],
	controllers: [AppController],
	providers: [AppService, UsersService],
})
export class AppModule {}
