'use client';
import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography, IconButton, Button, Snackbar, Alert } from '@mui/material';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { fetchCars} from '@/app/lib/data';
import { deleteCar as deleteCarAPI } from '@/app/lib/actions';
import { Car } from '@/app/utils/types/car';
import EditCarDialog from './edit-car-dialog';
import AddCarDialog from './add-car-dialog';
import useSnackbar from '@/app/hooks/useSnackbar';

const CarList: React.FC = () => {
  const [cars, setCars] = useState<Car[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [carToEdit, setCarToEdit] = useState<Car | null>(null);
  const { snackbarOpen, snackbarMessage, snackbarSeverity, openSnackbar, handleCloseSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedCars = await fetchCars();
        setCars(fetchedCars);
        setLoading(false);
      } catch (error) {
        setError('Failed to load cars');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDelete = async (carId: number) => {
    if (window.confirm('Etes-vous sûr de vouloir supprimer cette voiture ?')) {
      try {
        await deleteCarAPI(carId);
        setCars(cars.filter((car) => car.id !== carId));
        openSnackbar('Voiture supprimée avec succès.', 'success');
      } catch (error) {
        openSnackbar('Erreure de suppression', 'error');
      }
    }
  };

  const handleEditClick = (car: Car) => {
    setCarToEdit(car);
    setOpenEditDialog(true);
  };

  const handleAddCar = (newCar: Car) => {
    setCars([...cars, newCar]);
    openSnackbar('Car added successfully!', 'success');
  };

  const handleEditCarUpdate = (updatedCar: Car) => {
    const updatedCars = cars.map((car) =>
      car.id === updatedCar.id ? updatedCar : car
    );
    setCars(updatedCars);
    openSnackbar('Car updated successfully!', 'success');
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'model', headerName: 'Model', width: 150 },
    { field: 'kmPerHour', headerName: 'Vitesse (km/h)', width: 180 },
    {
      field: 'features',
      headerName: 'Caracteristiques',
      width: 250,
      renderCell: (params) => (
        <span>
        {params.value && params.value.length > 0
          ? params.value.join(', ')
          : ''}
      </span>
      ),
    },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      renderCell: (params) => (
        <Box>
          <IconButton color="primary" size="small" sx={{ marginRight: 1 }} onClick={() => handleEditClick(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton color="error" onClick={() => handleDelete(params.row.id)} size="small">
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  const rows: GridRowsProp = cars.map((car) => ({
    id: car.id,
    model: car.model,
    kmPerHour: car.kmPerHour,
    features: car.features || [],
  }));

  return (
    <Box>
      <Typography variant="h4">
        Voitures
      </Typography>
      <Button variant="contained" color="primary" onClick={() => setOpenAddDialog(true)} sx={{ marginBottom: 2 }}>
        Ajouter
      </Button>

      {loading && (
        <Box sx={{ display: 'flex', height: 400, width: '100%', justifyContent: 'center', marginTop: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {error && <Typography color="error">{error}</Typography>}

      {!loading && !error && (
        <div style={{ height: 400, width: '100%' }}>
          <DataGrid rows={rows} columns={columns} />
        </div>
      )}

      <EditCarDialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} car={carToEdit} onUpdate={handleEditCarUpdate} />
      <AddCarDialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} onAdd={handleAddCar} />

      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CarList;
