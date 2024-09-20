import React, { useState, useEffect } from 'react';
import { getRides } from "../../Services/RideService";
import "../Styles/DriverStyle.css";

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
    <div className="previous-rides-container">
      <h3>Previous Rides</h3>
      <ul className="ride-list">
        {rides.filter(ride => ride.rideStatus === 2).map((ride, index) => (
          <li className="ride-list-item" key={index}>
            <div className="ride-info">
              <span className="ride-label">From:</span> <span className="ride-value">{ride.startAddress || 'N/A'}</span>
            </div>
            <div className="ride-info">
              <span className="ride-label">To:</span> <span className="ride-value">{ride.endAddress || 'N/A'}</span>
            </div>
            <div className="ride-info">
              <span className="ride-label">Price:</span> <span className="ride-value">{ride.price} RSD</span>
            </div>
            <div className="ride-info">
              <span className="ride-label">Waiting time:</span> <span className="ride-value">{ride.waitingTime} minutes</span>
            </div>
            <div className="ride-info">
              <span className="ride-label">Travel time:</span> <span className="ride-value">{ride.travelTime} minutes</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DriverPreviousRides;