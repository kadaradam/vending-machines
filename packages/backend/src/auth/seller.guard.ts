import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { UserRequestType } from 'src/types';
import { RolesEnum } from 'src/users/user.schema';

@Injectable()
export class SellerGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		const { user }: UserRequestType = context.switchToHttp().getRequest();
		return user.role === RolesEnum.SELLER;
	}
}
