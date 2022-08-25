import { Box, Button } from "@mui/material";
import { coinVariants, prettyCurrency } from "src/utils";

type CoinSelectorProps = {
  setCoins: React.Dispatch<React.SetStateAction<number[]>>;
  valueOfCoins: number;
  max: number;
};

const CoinSelector = ({ setCoins, valueOfCoins, max }: CoinSelectorProps) => {
  return (
    <Box width="100%" display="flex" alignItems="center">
      {coinVariants.map((coinType) => (
        <Button
          size="small"
          variant="outlined"
          color="secondary"
          sx={{ m: 0.5 }}
          onClick={() => setCoins((prevState) => [...prevState, coinType])}
          disabled={valueOfCoins + coinType > max}
        >
          {prettyCurrency(coinType)}
        </Button>
      ))}
    </Box>
  );
};

export default CoinSelector;
