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

const DynamicModal = ({
  open,
  onClose,
  data,
  onSave,
  fields,
  title,
  userId,
}) => {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (open) {
      setFormData(data || {});
    }
  }, [open, data]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    const field = fields.find((f) => f.name === name);
    if (field?.onChange) {
      field.onChange(e);
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const transformedData = fields.reduce((acc, { id, name }) => {
      if (id && formData[name] !== undefined) {
        acc[id] = formData[name];
      }
      return acc;
    }, {});

    if (userId) {
      transformedData.user_id = userId;
    }

    onSave(transformedData);
    onClose();
  };


  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {fields.map((field) => (
          <TextField
            key={field.name}
            select={field.type === "select"}
            fullWidth
            margin="dense"
            label={field.label}
            name={field.name}
            value={formData[field.name] || ""}
            onChange={handleChange}
            disabled={field.disabled}
          >
            {field.type === "select" &&
              field.options.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
          </TextField>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained" color="error">
          Cancelar
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DynamicModal;
