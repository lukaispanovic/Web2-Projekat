import React from 'react';

const AdminRideList = ({ rides }) => {
  return (
    <div>
      <h3>All rides</h3>
      <ul>
        {rides.map((ride, index) => (
          <li key={index}>
            From: {ride.startAddress} To: {ride.endAddress} Price: {ride.price} RSD Travel Time: {ride.travelTime} minutes Status: {ride.rideStatus === 0 ? 'In Progress' : ride.rideStatus === 1 ? 'Waiting to be accepted' : ride.rideStatus === 2 ? 'Completed' : 'Unknown status'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminRideList;
