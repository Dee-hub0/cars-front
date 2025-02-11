import { z } from 'zod';

export const carSchema = z.object({
  model: z.string().min(1, { message: 'Model is required' }),
  kmPerHour: z.number().gt(0, { message: 'Speed must be greater than 0' }),
  features: z.array(z.string()).optional(),
});
