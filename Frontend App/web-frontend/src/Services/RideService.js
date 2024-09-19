
import axios from 'axios';


const axiosInstance = axios.create({
  baseURL:  process.env.REACT_APP_API_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
});


const setAuthToken = (token) => {
  if (token) {
    axiosInstance.defaults.headers.common['Authorization'] = token;
  } else {
    delete axiosInstance.defaults.headers.common['Authorization'];
  }
};


export const getRides = async (id, token) => {
  try {
    const response = await axiosInstance.get(`api/ride/all/${id ? id : ''}`,
      {
        headers: {
          Authorization: token,
        },});
    return response;
  } catch (error) {
    throw error;
  }
};


export const getAvailableRides = async (token) => {
  setAuthToken(token);
  try {
    const response = await axiosInstance.get('api/ride/available');
    return response;
  } catch (error) {
    throw error;
  }
};


export const createRide = async (rideData, token) => {
  setAuthToken(token);
  try {
    const response = await axiosInstance.post('api/ride/create', rideData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const finishRide = async (rideId, token) => {
  setAuthToken(token);
  try {
    const response = await axiosInstance.patch(`api/ride/finish/${rideId}`);
    return response;
  } catch (error) {
    throw error;
  }
};

export const acceptRide = async (rideId, driverId, token) => {
  setAuthToken(token);
  try {
    const response = await axiosInstance.patch(`api/ride/accept/${rideId}/${driverId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const isUserAtRide = async (userId, token) => {
  setAuthToken(token);
  try {
    const response = await axiosInstance.get(`api/ride/in-progress/${userId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const writeReview = async (rideId, review, token) => {
  setAuthToken(token);
  try {
    const response = await axiosInstance.patch(`api/ride/review/${rideId}/${review}`);
    return response;
  } catch (error) {
    throw error;
  }
};
