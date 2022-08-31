import { ProductType } from "src/types";
import axiosService from "../../axiosService";

export type getSellerProductsResponse = ProductType[];

export async function getSellerProducts(): Promise<getSellerProductsResponse> {
  const { data } = await axiosService.instance.get<getSellerProductsResponse>(
    "/products/seller"
  );

  return data;
}
