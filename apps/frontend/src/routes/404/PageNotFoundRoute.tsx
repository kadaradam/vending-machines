import { Box, Button, Typography } from "@mui/material";

const PageNotFoundRoute = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h1">404</Typography>
      <Typography variant="h6">
        The page you’re looking for doesn’t exist.
      </Typography>
      <Button href="/" variant="outlined" sx={{ mt: 3 }}>
        Back Home
      </Button>
    </Box>
  );
};

export default PageNotFoundRoute;
