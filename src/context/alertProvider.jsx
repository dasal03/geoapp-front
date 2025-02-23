import { createContext, useContext, useState } from "react";
import {
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";

const AlertContext = createContext();

export const AlertProvider = ({ children }) => {
  const [alertState, setAlertState] = useState({
    open: false,
    severity: "info",
    message: "",
  });

  const [confirmState, setConfirmState] = useState({
    open: false,
    title: "",
    message: "",
    onConfirm: null,
  });

  const showAlert = (severity, title, text) => {
    setAlertState({
      open: true,
      severity,
      message: `${title}: ${text}`,
    });
  };

  const closeAlert = () => {
    setAlertState((prev) => ({ ...prev, open: false }));
  };

  const showConfirm = (title, message, onConfirm) => {
    setConfirmState({
      open: true,
      title,
      message,
      onConfirm,
    });
  };

  const handleConfirmClose = () => {
    setConfirmState((prev) => ({ ...prev, open: false }));
  };

  const handleConfirm = () => {
    if (confirmState.onConfirm) {
      confirmState.onConfirm();
    }
    handleConfirmClose();
  };

  return (
    <AlertContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      <Snackbar
        open={alertState.open}
        autoHideDuration={6000}
        onClose={closeAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={closeAlert}
          severity={alertState.severity}
          sx={{ width: "100%" }}
        >
          {alertState.message}
        </Alert>
      </Snackbar>

      <Dialog open={confirmState.open} onClose={handleConfirmClose}>
        <DialogTitle>{confirmState.title}</DialogTitle>
        <DialogContent>
          <DialogContentText>{confirmState.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmClose}>Cancelar</Button>
          <Button onClick={handleConfirm} color="primary">
            Sí, confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);
