import { Car } from '@/app/utils/types/car';

export const createInitialCar = (): Partial<Car> => {
  return {
    model: '',
    kmPerHour: 0,
    features: [],
  };
};