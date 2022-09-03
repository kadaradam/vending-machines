import { Product } from 'src/products/products.schema';

export const ProductDTOStub = (
	{ cost }: Pick<Product, 'cost'> = { cost: 200 },
): Pick<Product, 'productName' | 'cost'> => {
	return {
		cost,
		productName: 'Cola',
	};
};
