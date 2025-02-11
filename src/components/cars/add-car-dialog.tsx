import React, { useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Snackbar, Alert } from '@mui/material';
import { Car } from '@/app/utils/types/car';
import { createCar } from '@/app/lib/actions';
import { checkModelExists } from '@/app/lib/data';
import useCarValidation from '@/app/hooks/useCarValidation';
import useSnackbar from '@/app/hooks/useSnackbar';
import { createInitialCar } from '@/app/utils/carHelpers'; 

interface AddCarDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (car: Car) => void;
}

const AddCarDialog: React.FC<AddCarDialogProps> = ({ open, onClose, onAdd }) => {
  const [newCar, setNewCar] = useState<Partial<Car>>(createInitialCar());
  const { errors, validateForm } = useCarValidation();
  const { snackbarOpen, snackbarMessage, snackbarSeverity, openSnackbar, handleCloseSnackbar } = useSnackbar();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    if (name === 'features') {
      setNewCar((prevCar) => ({
        ...prevCar,
        features: value.split(',').map((item) => item.trim()),
      }));
    } else {
      setNewCar((prevCar) => ({
        ...prevCar,
        [name]: name === 'kmPerHour' ? parseFloat(value) : value,
      }));
    }
  };
  
  const handleSubmit = async () => {
    if (!validateForm(newCar)) return;

    const modelExists = await checkModelExists(newCar.model);
    if (modelExists) {
      openSnackbar('Car model already exists.', 'error');
      return;
    }

    try {
      const createdCar = await createCar(newCar);
      onAdd(createdCar);
      onClose();
      setNewCar({ id: 0, model: '', kmPerHour: 0, features: [] });
      openSnackbar('Voiture ajoutée avec succès', 'success');
    } catch (error) {
      openSnackbar('Impossible d\'ajouter la voiture', 'error');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Ajouter une voiture</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          name="model"
          label="Model"
          fullWidth
          value={newCar.model}
          onChange={handleInputChange}
          error={!!errors.model}
          helperText={errors.model}
        />
        <TextField
          margin="dense"
          name="kmPerHour"
          label="Vitesse (km/h)"
          fullWidth
          type="number"
          value={newCar.kmPerHour}
          onChange={handleInputChange}
          error={!!errors.kmPerHour}
          helperText={errors.kmPerHour}
        />
        <TextField
          margin="dense"
          name="features"
          label="Caractéristiques (,)"
          fullWidth
          value={newCar.features?.join(', ')}
          onChange={handleInputChange}
          error={!!errors.features}
          helperText={errors.features}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Annuler
        </Button>
        <Button onClick={handleSubmit} color="primary">
          Enregistrer
        </Button>
      </DialogActions>

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Dialog>
  );
};

export default AddCarDialog;
