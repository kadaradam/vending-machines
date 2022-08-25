import { CoinWalletType } from "src/utils";
import axiosService from "../../axiosService";

export type BuyProductResponse = {
  spent: number;
  spentInCoins: CoinWalletType;
  changes: CoinWalletType;
  quantity: number;
  productId: string;
  productName: string;
};

export type BuyProductDto = {
  productId: string;
  coins: CoinWalletType;
  quantity: number;
};

export async function buyProductApi(
  buyProductDto: BuyProductDto
): Promise<BuyProductResponse> {
  const { productId, ...body } = buyProductDto;

  const { data } = await axiosService.instance.post<BuyProductResponse>(
    `/products/${productId}/buy`,
    body
  );

  return data;
}
