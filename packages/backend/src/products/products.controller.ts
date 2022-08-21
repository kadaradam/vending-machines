import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Post,
	Put,
	Request,
	UseGuards,
} from '@nestjs/common';
import { PublicForBuyer } from 'src/auth/public-for-buyer.metadata';
import { SellerGuard } from 'src/auth/seller.guard';
import { UserRequestType } from 'src/types';
import { BuyProductDto, CreateProductDto, UpdateProductDto } from './dto';
import { ProductsService } from './products.service';

@UseGuards(SellerGuard)
@Controller('products')
export class ProductsController {
	constructor(private readonly productsService: ProductsService) {}

	// For buyer to browse from products
	@PublicForBuyer()
	@Get()
	async getAllProducts() {
		return this.productsService.browseAll();
	}

	// For buyer to buy products
	@PublicForBuyer()
	@Post(':id/buy')
	async buyProducts(
		@Request() req: UserRequestType,
		@Param('id') id: string,
		@Body() buyProductDto: BuyProductDto,
	) {
		return this.productsService.buyProducts(req.user, id, buyProductDto);
	}

	// CRUD
	// For sellers to list all their products
	@Get('/my')
	async getPublicProducts(@Request() req: UserRequestType) {
		return this.productsService.findAll(req.user);
	}

	@Get(':id')
	async find(@Request() req: UserRequestType, @Param('id') id: string) {
		return this.productsService.findOne(req.user, id);
	}

	@Post()
	async create(@Request() req: UserRequestType, @Body() createProductDto: CreateProductDto) {
		return this.productsService.create(req.user, createProductDto);
	}

	@Put(':id')
	async update(
		@Request() req: UserRequestType,
		@Param('id') id: string,
		@Body() updateProductDto: UpdateProductDto,
	) {
		return this.productsService.update(req.user, id, updateProductDto);
	}

	@Delete(':id')
	async delete(@Request() req: UserRequestType, @Param('id') id: string) {
		return this.productsService.delete(req.user, id);
	}
}
