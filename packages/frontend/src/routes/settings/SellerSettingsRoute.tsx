import { Box, Typography } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { CardWithTitle, MainContainer } from "src/components";
import { getMyUserApi, getSellerBalanceApi } from "src/react-query/api";
import { Wallet } from "src/utils";

export const SellerSettingsRoute = () => {
  const { data: user, isLoading } = useQuery(["user"], getMyUserApi);
  const { data: balance } = useQuery(["seller-balance"], getSellerBalanceApi);

  // TODO: Add spinner
  if (isLoading || !user) {
    return null;
  }

  return (
    <MainContainer sx={{ pt: 2 }}>
      <CardWithTitle title={`${user.username}'s wallet`}>
        <Box
          width="100%"
          display="flex"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="body2">
            Total balance: {balance ? Wallet(balance).getBalance() : "-"}
          </Typography>
        </Box>
      </CardWithTitle>
    </MainContainer>
  );
};
