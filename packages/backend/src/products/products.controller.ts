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
import { Roles } from 'src/auth/roles.decorator';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserRequestType } from 'src/types';
import { RolesEnum } from 'src/users/user.schema';
import { BuyProductDto, CreateProductDto, UpdateProductDto } from './dto';
import { ProductsService } from './products.service';

@UseGuards(RolesGuard)
@Controller('products')
export class ProductsController {
	constructor(private readonly productsService: ProductsService) {}

	// For buyer to browse from products
	@Roles(RolesEnum.BUYER)
	@Get()
	async getBuyerProducts() {
		return this.productsService.browseAll();
	}

	// For buyer to buy products
	@Roles(RolesEnum.BUYER)
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
	@Roles(RolesEnum.SELLER)
	@Get('/my')
	async getSellerProducts(@Request() req: UserRequestType) {
		return this.productsService.findAll(req.user);
	}

	@Roles(RolesEnum.SELLER)
	@Get(':id')
	async find(@Request() req: UserRequestType, @Param('id') id: string) {
		return this.productsService.findOne(req.user, id);
	}

	@Roles(RolesEnum.SELLER)
	@Post()
	async create(@Request() req: UserRequestType, @Body() createProductDto: CreateProductDto) {
		return this.productsService.create(req.user, createProductDto);
	}

	@Roles(RolesEnum.SELLER)
	@Put(':id')
	async update(
		@Request() req: UserRequestType,
		@Param('id') id: string,
		@Body() updateProductDto: UpdateProductDto,
	) {
		return this.productsService.update(req.user, id, updateProductDto);
	}

	@Roles(RolesEnum.SELLER)
	@Delete(':id')
	async delete(@Request() req: UserRequestType, @Param('id') id: string) {
		return this.productsService.delete(req.user, id);
	}
}
