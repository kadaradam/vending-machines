import { Box, Typography } from "@mui/material";
import { prettyCurrency } from "@vending/utils";
import { ProductType } from "src/types";

type ProductItemProps = {
  item: ProductType;
  selected: boolean;
  onClick: () => void;
};

export const ProductItem = ({ item, selected, onClick }: ProductItemProps) => {
  const { productName, cost } = item;

  return (
    <Box
      sx={{
        width: "100%",
        padding: 1,
        borderStyle: "solid",
        display: "inline-block",
        cursor: "pointer",
        ...(selected
          ? { borderWidth: 2, borderColor: "primary.main" }
          : { borderWidth: 1, borderColor: "black" }),
      }}
      onClick={onClick}
    >
      <Typography variant="body2" sx={{ textAlign: "center" }}>
        {productName}
      </Typography>
      <Typography
        variant="caption"
        sx={{ color: "green", textAlign: "center" }}
      >
        {cost ? prettyCurrency(cost) : 0}
      </Typography>
    </Box>
  );
};
