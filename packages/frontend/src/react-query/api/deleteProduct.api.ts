import { ProductType } from "src/types";
import axiosService from "../../axiosService";

export type DeleteProductApiResponse = ProductType;

export type DeleteProductApiDto = {
  productId: string;
};

export async function deleteProductApi({
  productId,
}: DeleteProductApiDto): Promise<DeleteProductApiResponse> {
  const { data } = await axiosService.instance.delete<DeleteProductApiResponse>(
    `/products/${productId}`
  );

  return data;
}
