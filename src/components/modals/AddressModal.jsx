import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
} from "@mui/material";

const AddressModal = ({
  open,
  onClose,
  address,
  onSave,
  states,
  cities,
  fetchCities,
  userId,
}) => {
  const [formData, setFormData] = useState({
    user_id: "",
    state_id: "",
    city_id: "",
    address: "",
  });

  useEffect(() => {
    if (open) {
      if (address) {
        setFormData({
          user_id: address?.user_id || "",
          state_id: address?.state_id || "",
          city_id: address?.city_id || "",
          address: address?.address || "",
        });
      } else {
        setFormData({
          user_id: userId || "",
          state_id: "",
          city_id: "",
          address: "",
        });
      }
    }
  }, [open, address, userId]);

  useEffect(() => {
    if (formData.state_id) {
      fetchCities(formData.state_id);
    }
  }, [formData.state_id, fetchCities]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {address ? "Editar Dirección" : "Añadir Dirección"}
      </DialogTitle>
      <DialogContent>
        <TextField
          select
          fullWidth
          margin="dense"
          label="Departamento"
          name="state_id"
          value={formData.state_id}
          onChange={handleChange}
        >
          {states.map((state) => (
            <MenuItem key={state.value} value={state.value}>
              {state.label}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          fullWidth
          margin="dense"
          label="Ciudad"
          name="city_id"
          value={formData.city_id}
          onChange={handleChange}
          disabled={!formData.state_id || cities.length === 0}
        >
          {cities.length > 0 ? (
            cities.map((city) => (
              <MenuItem key={city.value} value={city.value}>
                {city.label}
              </MenuItem>
            ))
          ) : (
            <MenuItem disabled>No hay ciudades disponibles</MenuItem>
          )}
        </TextField>

        <TextField
          fullWidth
          margin="dense"
          label="Dirección"
          name="address"
          value={formData.address}
          onChange={handleChange}
        />
      </DialogContent>
      <DialogActions sx={{ padding: "16px", justifyContent: "space-between" }}>
        <Button
          onClick={onClose}
          variant="contained"
          sx={{
            borderRadius: "8px",
            padding: "8px 16px",
            fontWeight: "bold",
            backgroundColor: "#d32f2f",
            color: "#fff",
            "&:hover": { backgroundColor: "#b71c1c" },
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          sx={{
            borderRadius: "8px",
            padding: "8px 16px",
            fontWeight: "bold",
            backgroundColor: "#2e7d32",
            color: "#fff",
            "&:hover": { backgroundColor: "#1b5e20" },
          }}
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddressModal;
