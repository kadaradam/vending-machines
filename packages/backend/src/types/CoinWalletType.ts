import { Prop } from '@nestjs/mongoose';

export class CoinWalletType {
	@Prop({ default: 0 })
	100: number;

	@Prop({ default: 0 })
	50: number;

	@Prop({ default: 0 })
	20: number;

	@Prop({ default: 0 })
	10: number;

	@Prop({ default: 0 })
	5: number;
}
