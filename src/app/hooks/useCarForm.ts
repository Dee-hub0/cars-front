// useCarForm.ts (custom hook)
import { useState } from 'react';
import { Car } from '@/app/utils/types/car';

const useCarForm = (initialState: Partial<Car>) => {
  const [car, setCar] = useState<Partial<Car>>(initialState);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setCar((prevCar) => ({
      ...prevCar,
      [name]: name === 'features' ? value.split(',').map((item) => item.trim()) : value,
    }));
  };

  return {
    car,
    handleInputChange,
    setCar,
  };
};

export default useCarForm;