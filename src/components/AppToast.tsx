import { Alert, Snackbar } from "@mui/material";
import React from "react";

type Props = {
  text: string | undefined;
  type?: "error" | "success";
  setText: (v: string | undefined) => void;
};

const AppToast = ({ text, type = "error", setText }: Props) => {
  return (
    <Snackbar
      open={text !== undefined}
      autoHideDuration={2000}
      onClose={() => setText(undefined)}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert
        onClose={() => setText(undefined)}
        severity={type}
        sx={{ width: "100%" }}
      >
        {text}
      </Alert>
    </Snackbar>
  );
};

export default AppToast;
