import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/user.schema';
import { ProductsController } from './products.controller';
import { Product, ProductSchema } from './products.schema';
import { ProductsService } from './products.service';
@Module({
	imports: [
		MongooseModule.forFeature([
			{ name: User.name, schema: UserSchema },
			{ name: Product.name, schema: ProductSchema },
		]),
	],
	providers: [ProductsService],
	controllers: [ProductsController],
})
export class ProductsModule {}
