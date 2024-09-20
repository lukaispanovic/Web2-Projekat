import React from 'react';
import "../Styles/AdminStyle.css";

const AdminRideList = ({ rides }) => {
  return (
    <div className="ride-list-container">
      <h3 className="ride-list-title">All rides</h3>
      <ul>
        {rides.map((ride, index) => (
          <li className="ride-list-item" key={index}>
            From: {ride.startAddress} To: {ride.endAddress} Price: {ride.price} RSD Travel Time: {ride.travelTime} minutes Status: {ride.rideStatus === 0 ? 'In Progress' : ride.rideStatus === 1 ? 'Waiting to be accepted' : ride.rideStatus === 2 ? 'Completed' : 'Unknown status'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminRideList;
