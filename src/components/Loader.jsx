import { CircularProgress, Box, Typography } from "@mui/material";

export default function Loader() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress />
      <Typography variant="body1" sx={{ mt: 2 }}>
        Please wait!
      </Typography>
    </Box>
  );
}
