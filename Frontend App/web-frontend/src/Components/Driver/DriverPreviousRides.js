import React, { useState, useEffect } from 'react';
import { getRides } from "../../Services/RideService";

const DriverPreviousRides = () => {

  const [rides, setRides] = useState([]);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('token'));
        const tokenS = localStorage.getItem('encodedToken');
        const token2 = tokenS ? JSON.parse(tokenS) : null;
        const response = await getRides(token.id, token2);
        if(response.status === 200 && response.data.length !== 0){
            console.log(response.data);
            setRides(response.data); 
      }
      } catch (error) {
        console.error('Failed to fetch rides:', error);
      }
    };
    fetchRides();
  }, [])

  return (
    <div>
      <h3>Previous Rides</h3>
      <ul>
        {rides.filter(ride => ride.rideStatus === 2).map((ride, index) => (
          <li key={index}>
            From: {ride.startAddress} To: {ride.endAddress} Price: {ride.price} RSD Waiting time: {ride.waitingTime} minutes Travel time: {ride.travelTime} minutes
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DriverPreviousRides;