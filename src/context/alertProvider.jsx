import { createContext, useContext, useState, useCallback } from "react";
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
import { WarningAmber, CheckCircle, ErrorOutline } from "@mui/icons-material";

const getDialogIcon = (severity) => {
  const iconStyles = { fontSize: 40, mr: 1 };
  switch (severity) {
    case "success":
      return <CheckCircle color="success" sx={iconStyles} />;
    case "error":
      return <ErrorOutline color="error" sx={iconStyles} />;
    case "warning":
    default:
      return <WarningAmber color="warning" sx={iconStyles} />;
  }
};

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

  const showAlert = useCallback((severity, title, text) => {
    setAlertState({
      open: true,
      severity,
      message: `${title}: ${text}`,
    });
  }, []);

  const closeAlert = useCallback(() => {
    setAlertState((prev) => ({ ...prev, open: false }));
  }, []);

  const showConfirm = useCallback((title, message, onConfirm) => {
    setConfirmState({
      open: true,
      title,
      message,
      onConfirm,
    });
  }, []);

  const handleConfirmClose = useCallback(() => {
    setConfirmState((prev) => ({ ...prev, open: false }));
  }, []);

  const handleConfirm = useCallback(() => {
    if (confirmState.onConfirm) {
      confirmState.onConfirm();
    }
    handleConfirmClose();
  }, [handleConfirmClose, confirmState]);

  return (
    <AlertContext.Provider value={{ showAlert, showConfirm }}>
      {children}
      <Snackbar
        open={alertState.open}
        autoHideDuration={5000}
        onClose={closeAlert}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        TransitionProps={{
          onEnter: (node) => {
            node.style.opacity = 0;
            requestAnimationFrame(() => {
              node.style.transition = "opacity 300ms ease-in-out";
              node.style.opacity = 1;
            });
          },
        }}
      >
        <Alert
          onClose={closeAlert}
          severity={alertState.severity}
          variant="filled"
          iconMapping={{
            success: <CheckCircle fontSize="inherit" />,
            error: <ErrorOutline fontSize="inherit" />,
            warning: <WarningAmber fontSize="inherit" />,
            info: <WarningAmber fontSize="inherit" />,
          }}
          sx={{
            width: "100%",
            borderRadius: 2,
            boxShadow: 3,
            fontWeight: 500,
            px: 3,
            py: 2,
            alignItems: "center",
            bgcolor: (theme) =>
              theme.palette.mode === "dark"
                ? theme.palette.grey[800]
                : theme.palette[alertState.severity]?.main,
          }}
        >
          {alertState.message}
        </Alert>
      </Snackbar>

      <Dialog
        open={confirmState.open}
        onClose={handleConfirmClose}
        PaperProps={{
          sx: {
            borderRadius: 4,
            p: 3,
            boxShadow: 10,
            minWidth: 360,
            backgroundColor: (theme) =>
              theme.palette.mode === "dark" ? "#1c1c1c" : "#fff",
            animation: "fadeIn 0.3s ease-in-out",
          },
        }}
        TransitionProps={{
          onEnter: (node) => {
            node.style.opacity = 0;
            requestAnimationFrame(() => {
              node.style.transition = "opacity 300ms ease-in-out";
              node.style.opacity = 1;
            });
          },
        }}
      >
        <DialogTitle
          sx={{
            display: "flex",
            alignItems: "center",
            fontSize: "1.5rem",
            fontWeight: 600,
            mb: 1,
          }}
        >
          {getDialogIcon("warning")}
          {confirmState.title}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            sx={{
              fontSize: "1rem",
              color: (theme) =>
                theme.palette.mode === "dark" ? "grey.400" : "grey.800",
            }}
          >
            {confirmState.message}
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ justifyContent: "flex-end", gap: 1.5, mt: 2 }}>
          <Button
            onClick={handleConfirmClose}
            variant="outlined"
            color="inherit"
            sx={{
              textTransform: "none",
              borderRadius: 2,
              fontWeight: 500,
              transition: "all 0.2s ease-in-out",
              ":hover": {
                borderColor: "grey.500",
                backgroundColor: (theme) =>
                  theme.palette.mode === "dark" ? "grey.800" : "grey.100",
              },
            }}
          >
            Cancelar
          </Button>

          <Button
            onClick={handleConfirm}
            variant="contained"
            color="error"
            sx={{
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              px: 3,
              transition: "all 0.2s ease-in-out",
              bgcolor: "error.dark",
              ":hover": {
                bgcolor: "error.main",
                boxShadow: 4,
              },
            }}
          >
            Sí, confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </AlertContext.Provider>
  );
};

export const useAlert = () => useContext(AlertContext);
