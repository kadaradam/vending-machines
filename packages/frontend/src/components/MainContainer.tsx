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
import { useAuth } from "src/hooks";

export const MainContainer = ({
  children,
  sx,
}: {
  children: React.ReactNode;
  sx?: SxProps<Theme> | undefined;
}) => {
  const { handleLogout } = useAuth();

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
