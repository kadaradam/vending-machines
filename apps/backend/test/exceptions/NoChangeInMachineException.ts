import { HttpException, HttpStatus } from '@nestjs/common';

export class NoChangeInMachineException extends HttpException {
	constructor() {
		super('Not enough changes in the machine', HttpStatus.CONFLICT);
	}
}
