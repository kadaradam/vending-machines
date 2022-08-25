import { Settings } from "@mui/icons-material";
import LogoutIcon from "@mui/icons-material/Logout";
import {
  AppBar,
  Box,
  Container,
  IconButton,
  SxProps,
  Theme,
  Toolbar,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ROLE_ROUTER_NAMES } from "src/constants";
import { useAuth } from "src/hooks";
import { getMyUserApi } from "src/react-query/api";

export const MainContainer = ({
  children,
  sx,
}: {
  children: React.ReactNode;
  sx?: SxProps<Theme> | undefined;
}) => {
  const { handleLogout } = useAuth();
  const navigate = useNavigate();
  const { data: user } = useQuery(["user"], getMyUserApi);

  return (
    <>
      <AppBar position="static" color="default">
        <Toolbar variant="dense">
          <Box
            width="100%"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Box display="flex" alignItems="center">
              <Typography variant="h6">Vending Machine App</Typography>
            </Box>
            <Box display="flex" alignItems="center">
              {user && (
                <IconButton
                  onClick={() =>
                    navigate(`/${ROLE_ROUTER_NAMES[user?.role]}/settings`)
                  }
                  aria-label="toggle-theme"
                >
                  <Settings sx={{ fontSize: 20 }} />
                </IconButton>
              )}

              <IconButton onClick={handleLogout} aria-label="toggle-theme">
                <LogoutIcon sx={{ fontSize: 20 }} />
              </IconButton>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ ...sx, pt: 3 }}>
        {children}
      </Container>
    </>
  );
};
