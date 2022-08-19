import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRequestType } from 'src/types';
import { RolesEnum } from 'src/users/user.schema';
import { IS_PUBLIC_FOR_BUYER_KEY } from './public-for-buyer.metadata';

@Injectable()
export class SellerGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const isPublicForBuyer = this.reflector.getAllAndOverride<boolean>(
			IS_PUBLIC_FOR_BUYER_KEY,
			[context.getHandler(), context.getClass()],
		);

		if (isPublicForBuyer) {
			return true;
		}

		const { user }: UserRequestType = context.switchToHttp().getRequest();
		return user.role === RolesEnum.SELLER;
	}
}
