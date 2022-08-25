import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import { Box, Button, Card, Grid, IconButton, Typography } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { toast } from "react-toastify";
import { MainContainer, ProductItem } from "src/components";
import CoinSelector from "src/components/CoinSelector";
import {
  buyProductApi,
  getBuyerProducts,
  getMyUserApi,
} from "src/react-query/api";
import { CoinWalletType, prettyCurrency, Wallet } from "src/utils";

function arrayToObject(arr: number[]) {
  return arr.reduce((currentValue: CoinWalletType, nextValue) => {
    currentValue[nextValue] = currentValue[nextValue]
      ? currentValue[nextValue] + 1
      : 1;

    return currentValue;
  }, {});
}

export const BuyerDashboardRoute = () => {
  const [selectedId, setSelectedId] = useState<string>("");
  const [coins, setCoins] = useState<number[]>([]);
  const [productQuantity, setProductQuantity] = useState<number>(1);
  const {
    data: user,
    refetch: refetchUser,
    isLoading: isUserLoading,
  } = useQuery(["user"], getMyUserApi);
  const { data: products, isLoading: isProductsLoading } = useQuery(
    ["products-buyer"],
    getBuyerProducts
  );
  const { mutate: buyProduct, isLoading: isBuyLoading } = useMutation(
    buyProductApi,
    {
      onSuccess: () => {
        toast("Success");
        refetchUser();
      },
    }
  );

  const valueOfSelected = useMemo(() => {
    if (!selectedId) {
      return 0;
    }

    const selectedProduct = products?.find(
      (product) => product._id === selectedId
    );

    if (!selectedProduct) {
      return 0;
    }

    return selectedProduct.cost * productQuantity;
  }, [selectedId, products, productQuantity]);

  const valueOfInserted = useMemo(
    () => Wallet(arrayToObject(coins)).getBalance(),
    [coins]
  );

  const balanceOfUser = useMemo(
    () => (user?.deposit ? Wallet(user.deposit).getBalance() : 0),
    [user]
  );

  if (isUserLoading || isProductsLoading || !user) {
    // TODO Add spinning
    return null;
  }

  return (
    <MainContainer>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Grid container spacing={1}>
            {products?.map((product) => (
              <Grid item xs={3} key={product._id}>
                <ProductItem
                  item={product}
                  selected={product._id === selectedId}
                  onClick={() => setSelectedId(product._id)}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Card sx={{ p: 2, mb: 2 }} elevation={2}>
            <Typography variant="body1" sx={{ pb: 1 }}>
              Wallet
            </Typography>
            <Typography variant="body2" sx={{ pb: 0.5 }}>
              Product's price:{" "}
              <strong>
                {valueOfSelected ? prettyCurrency(valueOfSelected) : "-"}
              </strong>
            </Typography>
            <Typography variant="body2" sx={{ pb: 0.5 }}>
              Your balance: <strong>{prettyCurrency(balanceOfUser)}</strong>
            </Typography>
            <Typography variant="body2">
              Inserted value:{" "}
              <strong>
                {valueOfInserted ? prettyCurrency(valueOfInserted) : "-"}
              </strong>
            </Typography>
          </Card>
          <Card sx={{ p: 2, mb: 2 }} elevation={2}>
            <Typography variant="body1" sx={{ pb: 1 }}>
              Insert your coins
            </Typography>
            <CoinSelector
              coins={coins}
              setCoins={setCoins}
              valueOfCoins={valueOfInserted}
              max={balanceOfUser}
              wallet={user.deposit}
            />
          </Card>
          <Card sx={{ p: 2, mb: 2 }} elevation={2}>
            <Box
              display="flex"
              alignItems="center"
              justifyContent="space-between"
            >
              <Box>
                <Typography variant="body1" sx={{ pb: 1 }}>
                  Quantity
                </Typography>
                <IconButton
                  onClick={() =>
                    setProductQuantity((prevState) => prevState + 1)
                  }
                >
                  <AddIcon />
                </IconButton>
                <IconButton
                  onClick={() =>
                    setProductQuantity((prevState) =>
                      prevState > 1 ? prevState - 1 : 1
                    )
                  }
                >
                  <RemoveIcon />
                </IconButton>
              </Box>
              <Typography
                variant="caption"
                sx={{
                  width: "100%",
                  textAlign: "center",
                  fontSize: 32,
                  fontWeight: "bold",
                }}
              >
                {productQuantity}
              </Typography>
            </Box>
          </Card>

          <Button
            color="primary"
            variant="contained"
            fullWidth
            onClick={() =>
              buyProduct({
                productId: selectedId,
                quantity: productQuantity,
                coins: arrayToObject(coins),
              })
            }
            disabled={
              !selectedId || valueOfSelected > valueOfInserted || isBuyLoading
            }
          >
            Buy
          </Button>
        </Grid>
      </Grid>
    </MainContainer>
  );
};
