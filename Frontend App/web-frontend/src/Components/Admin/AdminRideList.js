import React from 'react';

const AdminRideList = ({ rides }) => {
  return (
    <div>
      <h3>All rides</h3>
      <ul>
        {rides.map((ride, index) => (
          <li key={index}>
            From: {ride.startAddress} To: {ride.endAddress} Price: {ride.price} RSD Travel Time: {ride.travelTime} minutes Status: {ride.accepted ? (ride.completed ? 'Completed' : 'Accepted') : 'Waiting to be accepted'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminRideList;
