import { Box, Button, Typography } from "@mui/material";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { CardWithTitle, MainContainer } from "src/components";
import {
  depositBalance,
  getMyUserApi,
  resetBalance,
} from "src/react-query/api";
import { Wallet } from "src/utils";

export const BuyerSettingsRoute = () => {
  const {
    data: user,
    refetch: refetchUser,
    isLoading,
  } = useQuery(["user"], getMyUserApi);
  const { mutate: reset, isLoading: isResetLoading } = useMutation(
    resetBalance,
    {
      onSuccess: () => {
        toast("Success");
        refetchUser();
      },
    }
  );
  const { mutate: deposit, isLoading: isDepositLoading } = useMutation(
    depositBalance,
    {
      onSuccess: () => {
        toast("Success");
        refetchUser();
      },
    }
  );

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
            Balance: {Wallet(user.deposit).getBalance()}
          </Typography>
          <Box>
            <Button
              onClick={() =>
                deposit({ coins: { 100: 1, 50: 0, 20: 0, 10: 0, 5: 0 } })
              }
              disabled={isDepositLoading}
              variant="contained"
              color="primary"
              sx={{ mr: 1 }}
            >
              Add Balance
            </Button>
            <Button
              onClick={() => reset()}
              disabled={isResetLoading}
              variant="contained"
              color="secondary"
            >
              Reset Balance
            </Button>
          </Box>
        </Box>
      </CardWithTitle>
    </MainContainer>
  );
};
