import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ProductsModule } from './products/products.module';
import { UsersModule } from './users/users.module';

@Module({
	imports: [
		MongooseModule.forRootAsync({
			useFactory: () => ({
				// TODO: Read from ENV config
				uri: 'mongodb://localhost/vending',
			}),
		}),
		UsersModule,
		ProductsModule,
		AuthModule,
	],
	controllers: [AppController],
	providers: [
		AppService,
		{
			provide: APP_GUARD,
			useClass: JwtAuthGuard,
		},
	],
})
export class AppModule {}
