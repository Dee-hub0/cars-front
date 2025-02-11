import { z } from 'zod';

export const timeCalculationSchema = z.object({
  model: z.string().min(1, { message: 'Car model is required' }),
  distance: z.number().gt(0, { message: 'Distance must be greater than 0' }),
});