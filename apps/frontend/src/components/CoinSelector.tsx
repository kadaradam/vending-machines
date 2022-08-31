import { Box, Button } from "@mui/material";
import { CoinWalletType } from "@vending/types";
import { coinVariants, prettyCurrency } from "@vending/utils";

type CoinSelectorProps = {
  coins: number[];
  setCoins: React.Dispatch<React.SetStateAction<number[]>>;
  valueOfCoins: number;
  max: number;
  wallet: CoinWalletType;
};

const getCountOfCoins = (coins: number[], coinType: number) =>
  coins.filter((coin) => coin === coinType).length;

const CoinSelector = ({
  coins,
  setCoins,
  valueOfCoins,
  max,
  wallet,
}: CoinSelectorProps) => {
  return (
    <Box width="100%" display="flex" alignItems="center">
      {coinVariants.map((coinType) => (
        <Button
          key={coinType}
          size="small"
          variant="outlined"
          color="secondary"
          sx={{ m: 0.5 }}
          onClick={() => setCoins((prevState) => [...prevState, coinType])}
          disabled={
            valueOfCoins + coinType > max ||
            wallet[coinType] <= 0 ||
            wallet[coinType] <= getCountOfCoins(coins, coinType)
          }
        >
          {wallet[coinType] - getCountOfCoins(coins, coinType)} x{" "}
          {prettyCurrency(coinType)}
        </Button>
      ))}
    </Box>
  );
};

export default CoinSelector;
