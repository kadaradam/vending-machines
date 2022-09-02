import { HttpException, HttpStatus } from '@nestjs/common';

export class ProductAlreadyExistsException extends HttpException {
	constructor() {
		super('Product already exists', HttpStatus.CONFLICT);
	}
}
