'use client';
import React, { useState } from 'react';
import { TextField, Button, Typography, Snackbar, Alert } from '@mui/material';
import { calculateTime } from '@/app/lib/actions';
import useCarTimeForm from '@/app/hooks/useCarTimeForm';
import useSnackbar from '@/app//hooks/useSnackbar';

const CalculateTimePage = () => {
  const { formState, validationErrors, handleChange, validate } = useCarTimeForm();
  const { snackbarOpen, snackbarMessage, snackbarSeverity, openSnackbar, handleCloseSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [calculatedTime, setCalculatedTime] = useState<number | null>(null);

  const handleCalculateTime = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const result = await calculateTime(formState.model, formState.distance);
      setCalculatedTime(result?.time ?? null);
      openSnackbar(result?.message, (result.httpCode == 200?'success':'error'));
    } catch (error) {
      openSnackbar('Failed to calculate time', 'error');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <Typography variant="h6" gutterBottom>
      Calculer le temps nécessaire à la voiture pour parcourir une distance
      </Typography>

      <TextField
        label="Car Model"
        name="model"
        value={formState.model}
        onChange={handleChange}
        fullWidth
        variant="outlined"
        margin="normal"
        error={!!validationErrors.model}
        helperText={validationErrors.model}
      />
      <TextField
        label="Distance (km)"
        name="distance"
        type="number"
        value={formState.distance}
        onChange={handleChange}
        fullWidth
        variant="outlined"
        margin="normal"
        error={!!validationErrors.distance}
        helperText={validationErrors.distance}
      />
      <Button
        onClick={handleCalculateTime}
        variant="contained"
        color="primary"
        disabled={loading}
        style={{ marginTop: '1rem' }}
      >
        {loading ? 'Calcul...' : 'Calculer'}
      </Button>

      {calculatedTime !== null && (
        <Typography variant="h6" color="primary" style={{ marginTop: '1rem' }}>
          {calculatedTime} minutes
        </Typography>
      )}

      {/* Snackbar for feedback */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CalculateTimePage;