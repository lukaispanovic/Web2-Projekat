import React, { useState, useEffect } from 'react';
import { getAvailableRides, acceptRide } from "../../Services/RideService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const DriverNewRidesList = () => {
  
  const [rides, setRides] = useState([]);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const tokenS = localStorage.getItem('encodedToken');
        const token = tokenS ? JSON.parse(tokenS) : null;

        const response = await getAvailableRides(token);

        if(response.status === 200 && response.data.length !== 0)
          setRides(response.data); 
      } catch (error) {
        console.error('Failed to fetch rides:', error);
      }
    };
    fetchRides();
  }, [])


  const onAcceptRide = async (index) => {
    try {
      const token = JSON.parse(localStorage.getItem('token'));
      const encodedToken = JSON.parse(localStorage.getItem('encodedToken'));
      const rideId = rides[index].id;
      const driverId = token.id;
      
      await acceptRide(rideId,driverId, encodedToken);
      
      const updatedRides = [...rides];
      updatedRides[index].accepted = true;
      setRides(updatedRides);
      if (rideId !== 0) {
        localStorage.setItem('inProgress', true);
        navigate("/inprogressDriver", { replace: true });
      } else {
        toast.error("Unable to accept ride!");
      }

    } catch (error) {
      console.error('Failed to accept the ride:', error);
    }
  };

  return (
    <div>
      <h3>Rides waiting to be accepted</h3>
      <ul>
        {rides.filter(ride => (ride.rideStatus === 1)).map((ride, index) => (
          <li key={index}>
            From: {ride.startAddress} To: {ride.endAddress} Price: {ride.price} RSD Travel time: {ride.travelTime} min
            <button onClick={() => onAcceptRide(index)}>Accept</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DriverNewRidesList;
