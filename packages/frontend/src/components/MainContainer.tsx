import LogoutIcon from "@mui/icons-material/Logout";
import {
  AppBar,
  Box,
  Container,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import { useAuth } from "src/hooks";

const MainContainer = ({ children }: { children: React.ReactNode }) => {
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
      <Container component="main">{children}</Container>
    </>
  );
};

export default MainContainer;
