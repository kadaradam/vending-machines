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
import { SellerGuard } from 'src/auth/seller.guard';
import { UserRequestType } from 'src/types';
import { CreateProductDto, UpdateProductDto } from './dto';
import { ProductsService } from './products.service';

@UseGuards(SellerGuard)
@Controller('products')
export class ProductsController {
	constructor(private readonly productsService: ProductsService) {}

	@Get()
	async get(@Request() req: UserRequestType) {
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
