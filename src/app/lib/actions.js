
import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const createCar = async (carData) => {
  const response = await axios.post(API_URL, carData, {
    headers: {
        'Content-Type': 'application/ld+json',
      }
  });
  return response.data;
};

export const updateCar = async (id, carData) => {
    const response = await axios.put(`${API_URL}/${id}`, carData, {
      headers: {
          'Content-Type': 'application/ld+json',
        }
    });
    return response.data;
  };

export const deleteCar = async (id) => {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  };


export const calculateTime = async (model, distance) => {
  const response = await axios.post(
    `${API_URL}/calculate-time`, 
    {
      model,
      distance,
    },
    {
      headers: {
        'Content-Type': 'application/ld+json',
      },
    }
  );
  return response.data;
};

  