import { useState } from 'react';
import { z } from 'zod';
import { timeCalculationSchema } from '@/app/utils/columns/time-calculation-schema';

interface FormState {
  model: string;
  distance: number;
}

const useCarTimeForm = () => {
  const [formState, setFormState] = useState<FormState>({ model: '', distance: 0 });
  const [validationErrors, setValidationErrors] = useState<{ model?: string; distance?: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: name === 'distance' ? Number(value) : value,
    }));
  };

  const validate = () => {
    try {
      timeCalculationSchema.parse(formState); // Validate form with Zod schema
      setValidationErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors: { model?: string; distance?: string } = {};
        error.errors.forEach((err) => {
          errors[err.path[0] as keyof typeof errors] = err.message;
        });
        setValidationErrors(errors);
        return false;
      }
    }
  };

  return { formState, validationErrors, handleChange, validate };
};

export default useCarTimeForm;
