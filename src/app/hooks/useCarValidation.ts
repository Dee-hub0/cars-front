import { useState } from 'react';
import { z } from 'zod';
import { carSchema } from '@/app/utils/columns/car-schema';
import { Car } from '@/app/utils/types/car';

const useCarValidation = () => {
  const [errors, setErrors] = useState<{ [key: string]: string | null }>({});

  const validateForm = (car: Car) => {
    try {
      carSchema.parse(car); // If validation passes, do nothing
      setErrors({}); // Clear previous errors
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrors: { [key: string]: string } = {};
        error.errors.forEach((err) => {
          validationErrors[err.path[0]] = err.message;
        });
        setErrors(validationErrors);
      }
      return false; // Validation failed
    }
  };

  return { errors, validateForm };
};

export default useCarValidation;