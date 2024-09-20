import React, { useState, useEffect } from 'react';
import { getAvailableRides, acceptRide } from "../../Services/RideService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { GetUserData } from "../../Services/UserService";
import "../Styles/DriverStyle.css";

const DriverNewRidesList = () => {
  
  const [rides, setRides] = useState([]);
  const [isBlocked, setIsBlocked] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const tokenS = localStorage.getItem('encodedToken');
        const token = tokenS ? JSON.parse(tokenS) : null;

        const response = await getAvailableRides(token);

        if (response.status === 200 && response.data.length !== 0) {
          setRides(response.data); 
        }
      } catch (error) {
        console.error('Failed to fetch rides:', error);
      }
    };

    const fetchDriverInfo = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('token'));
        const driverInfo = await GetUserData(token.id);

        if (driverInfo && driverInfo.data) {
          setIsBlocked(driverInfo.data.blocked === true);
        }
      } catch (error) {
        console.error('Failed to fetch driver info:', error);
      }
    };

    fetchRides();
    fetchDriverInfo();
  }, []);

  const onAcceptRide = async (index) => {
    if (isBlocked) {
      toast.error("You are blocked from accepting rides.");
      return;
    }

    try {
      const token = JSON.parse(localStorage.getItem('token'));
      const encodedToken = JSON.parse(localStorage.getItem('encodedToken'));
      const rideId = rides[index].id;
      const driverId = token.id;

      await acceptRide(rideId, driverId, encodedToken);

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
    <div className="new-rides-container">
      <h3>Rides waiting to be accepted</h3>
      <ul className="ride-list">
        {rides.filter(ride => (ride.rideStatus === 1)).map((ride, index) => (
          <li className="ride-list-item" key={index}>
            <div className="ride-details">
              <p><strong>From:</strong> {ride.startAddress}</p>
              <p><strong>To:</strong> {ride.endAddress}</p>
              <p><strong>Price:</strong> {ride.price} RSD</p>
              <p><strong>Travel Time:</strong> {ride.travelTime} min</p>
            </div>
            <button className="accept-button" onClick={() => onAcceptRide(index)}>Accept</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DriverNewRidesList;
