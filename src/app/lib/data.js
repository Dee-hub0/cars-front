import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const fetchCars = async () => {
  const response = await axios.get(API_URL);
  return response.data.member;
};

export const fetchCarById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const checkModelExists = async (model) => {
  try {
    const response = await axios.get(`${API_URL}?model=${model}`);
    return response.data.totalItems > 0;
  } catch (error) {
    console.error('Error checking model:', error);
    return false;
  }
};
