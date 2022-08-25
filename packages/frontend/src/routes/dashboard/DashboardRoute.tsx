import { Button, Card, Grid, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { MainContainer, ProductItem } from "src/components";
import CoinSelector from "src/components/CoinSelector";
import { getBuyerProducts, getMyUserApi } from "src/react-query/api";
import { CoinWalletType, prettyCurrency, Wallet } from "src/utils";

function arrayToObject(arr: number[]) {
  return arr.reduce((currentValue: CoinWalletType, nextValue) => {
    currentValue[nextValue] = currentValue[nextValue]
      ? currentValue[nextValue] + 1
      : 1;

    return currentValue;
  }, {});
}

const DashboardRoute = () => {
  const [selectedId, setSelectedId] = useState<string>("");
  const [coins, setCoins] = useState<number[]>([]);
  const { data: user, isLoading: isUserLoading } = useQuery(
    ["user"],
    getMyUserApi
  );
  const { data: products, isLoading: isProductsLoading } = useQuery(
    ["products"],
    getBuyerProducts
  );

  const valueOfSelected = useMemo(
    () =>
      selectedId
        ? products?.find((product) => product._id === selectedId)?.cost ?? 0
        : 0,
    [selectedId, products]
  );

  const valueOfInserted = useMemo(
    () => Wallet(arrayToObject(coins)).getBalance(),
    [coins]
  );

  const balanceOfUser = useMemo(
    () => (user?.deposit ? Wallet(user.deposit).getBalance() : 0),
    [user]
  );

  const handleSubmit = () => console.log("submit");

  if (isUserLoading || isProductsLoading) {
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
                  // @ts-ignore
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
              setCoins={setCoins}
              valueOfCoins={valueOfInserted}
              max={balanceOfUser}
            />
          </Card>

          <Button
            color="primary"
            variant="contained"
            fullWidth
            onClick={handleSubmit}
            disabled={!selectedId || valueOfSelected > valueOfInserted}
          >
            Buy
          </Button>
        </Grid>
      </Grid>
    </MainContainer>
  );
};

export default DashboardRoute;
