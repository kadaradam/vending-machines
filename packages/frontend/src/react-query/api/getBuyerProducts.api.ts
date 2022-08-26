import { ProductType } from "src/types";
import axiosService from "../../axiosService";

export type getBuyerProductsResponse = ProductType[];

export async function getBuyerProducts(): Promise<getBuyerProductsResponse> {
  const { data } = await axiosService.instance.get<getBuyerProductsResponse>(
    "/products/buyer"
  );

  return data;
}
