import { HttpException, HttpStatus } from '@nestjs/common';

export class NonExistentCoinsException extends HttpException {
	constructor() {
		super('Coins does not exists', HttpStatus.CONFLICT);
	}
}
