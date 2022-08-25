import { ProductType } from "src/types";
import axiosService from "../../axiosService";

export type AddProductApiResponse = ProductType;

export type AddProductApiDto = {
  productName: string;
  cost: number;
};

export async function addProductApi(
  addProductDto: AddProductApiDto
): Promise<AddProductApiResponse> {
  const { data } = await axiosService.instance.post<AddProductApiResponse>(
    "/products",
    addProductDto
  );

  return data;
}
