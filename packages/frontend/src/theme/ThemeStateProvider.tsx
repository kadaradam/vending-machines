import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./theme";

interface ThemeStateProviderProps {
  children?: React.ReactNode;
}

export const ThemeStateProvider = (props: ThemeStateProviderProps) => (
  <ThemeProvider theme={theme}>
    <CssBaseline />
    {props.children}
  </ThemeProvider>
);
