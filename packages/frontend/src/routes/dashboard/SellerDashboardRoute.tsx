import DeleteIcon from "@mui/icons-material/Delete";
import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { MainContainer } from "src/components";
import AddProductFab from "src/components/AddProductFab";
import {
  deleteProductApi,
  getMyUserApi,
  getSellerProducts,
} from "src/react-query/api";
import { prettyCurrency, Wallet } from "src/utils";

export const SellerDashboardRoute = () => {
  const { data: user, isLoading: isUserLoading } = useQuery(
    ["user"],
    getMyUserApi
  );
  const {
    data: products,
    refetch: refetchProducts,
    isLoading: isProductsLoading,
  } = useQuery(["products-seller"], getSellerProducts);
  const { mutate: deleteProduct, isLoading: isDeleteLoading } = useMutation(
    deleteProductApi,
    {
      onSuccess: () => {
        toast("Success");
        refetchProducts();
      },
    }
  );

  if (isUserLoading || isProductsLoading || !user) {
    // TODO Add spinning
    return null;
  }

  return (
    <MainContainer>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Product name</TableCell>
              <TableCell align="right">Price (in cents)</TableCell>
              <TableCell align="right">Balance</TableCell>
              <TableCell align="right" />
              {/* Delete Icon */}
            </TableRow>
          </TableHead>
          <TableBody>
            {products?.map((row) => (
              <TableRow
                key={row._id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.productName}
                </TableCell>
                <TableCell align="right">{row.cost}</TableCell>
                <TableCell align="right">
                  {prettyCurrency(Wallet(row.amountAvailable).getBalance())}
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    disabled={isDeleteLoading}
                    onClick={() => deleteProduct({ productId: row._id })}
                  >
                    <DeleteIcon sx={{ fontSize: 20 }} />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <AddProductFab refetch={refetchProducts} />
    </MainContainer>
  );
};
