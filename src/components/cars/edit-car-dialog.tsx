import React, { useState, useEffect } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField, Button, Snackbar, Alert } from '@mui/material';
import { Car } from '@/app/utils/types/car';
import { updateCar as updateCarAPI } from '@/app/lib/actions';
import { checkModelExists } from '@/app/lib/data';
import useCarValidation from '@/app/hooks/useCarValidation';
import useSnackbar from '@/app/hooks/useSnackbar';

interface EditCarDialogProps {
  open: boolean;
  onClose: () => void;
  car: Car | null;
  onUpdate: (updatedCar: Car) => void;
}

const EditCarDialog: React.FC<EditCarDialogProps> = ({ open, onClose, car, onUpdate }) => {
  const [editedCar, setEditedCar] = useState<Car | null>(null);
  const { errors, validateForm } = useCarValidation();
  const { snackbarOpen, snackbarMessage, snackbarSeverity, setSnackbar, handleCloseSnackbar } = useSnackbar(); // Custom hook for snackbar

  useEffect(() => {
    if (car) {
      setEditedCar({ ...car });
    }
  }, [car]);

  const handleInputChange = (field: keyof Car, value: any) => {
    setEditedCar((prevCar) => {
      if (prevCar) {
        if (field === 'features') {
          return { ...prevCar, features: value.split(',').map((item: string) => item.trim()) };
        }
        return { ...prevCar, [field]: value };
      }
      return prevCar;
    });
  };
  
  

  const handleSave = async () => {
    if (!editedCar) return;

    if (!validateForm(editedCar)) return;

    const modelExists = await checkModelExists(editedCar.model);
    if (modelExists) {
      setSnackbar('Car model already exists.', 'error');
      return;
    }

    try {
      const updatedCar = await updateCarAPI(editedCar.id, editedCar);
      // Pass the updated car to parent
      onUpdate(updatedCar);
      onClose();
      setSnackbar('Données mises à jour avec succès', 'success');
    } catch (error) {
      console.error('Échec de la mise à jour', error);
      setSnackbar('Échec de la mise à jour', 'error');
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Modifier la voiture</DialogTitle>
      <DialogContent>
        {editedCar && (
          <>
            <TextField
              label="Model"
              value={editedCar.model}
              onChange={(e) => handleInputChange('model', e.target.value)}
              fullWidth
              margin="normal"
              error={!!errors.model}
              helperText={errors.model}
            />
            <TextField
              label="Vitesse (km/h)"
              type="number"
              value={editedCar.kmPerHour}
              onChange={(e) => handleInputChange('kmPerHour', parseInt(e.target.value))}
              fullWidth
              margin="normal"
              error={!!errors.kmPerHour}
              helperText={errors.kmPerHour}
            />
            <TextField
              label="Caractéristiques (,)"
              value={editedCar.features?.join(', ')}
              onChange={(e) => handleInputChange('features', e.target.value)}
              fullWidth
              margin="normal"
              error={!!errors.features}
              helperText={errors.features}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Annuler
        </Button>
        <Button onClick={handleSave} color="primary" variant="contained">
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

export default EditCarDialog;
