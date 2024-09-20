import React, { useEffect } from 'react';
import { GetUserData } from '../Services/UserService';
import { useNavigate } from 'react-router-dom';

const Unauthorized = () => {
  const navigate = useNavigate();

  const fetchUserData = async () => {
    const token = JSON.parse(localStorage.getItem('token'));
    if (token) {
      const response = await GetUserData(token.id);
      if (response && response.data) {
        const userData = JSON.parse(localStorage.getItem('user')) || {};
        userData.verified = response.data.verified; // Update the verified field

        localStorage.setItem('user', JSON.stringify(userData)); // Save the updated user data

        if (userData.verified) {
          navigate('/home/profile');
        }
      }
    }
  };

  useEffect(() => {
    fetchUserData();

    const intervalId = setInterval(fetchUserData, 15000);

    return () => clearInterval(intervalId);
  }, [navigate]);

  return (
    <p>You are not authorized/verified.</p>
  );
};

export default Unauthorized;
