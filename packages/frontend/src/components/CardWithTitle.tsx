import { Box, Card, Typography } from "@mui/material";

export const CardWithTitle = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <Card sx={{ p: 2 }}>
    <Typography variant="body2" gutterBottom sx={{ fontWeight: "bold" }}>
      {title}
    </Typography>
    <Box>{children}</Box>
  </Card>
);
