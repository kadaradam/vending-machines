import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./theme";

type ThemeStateProviderProps = {
  children?: React.ReactNode;
};

export const ThemeStateProvider = ({ children }: ThemeStateProviderProps) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {children}
  </ThemeProvider>
);
