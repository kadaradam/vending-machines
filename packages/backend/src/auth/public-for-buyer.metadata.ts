import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_FOR_BUYER_KEY = 'isPublicForBuyer';
export const PublicForBuyer = () => SetMetadata(IS_PUBLIC_FOR_BUYER_KEY, true);
