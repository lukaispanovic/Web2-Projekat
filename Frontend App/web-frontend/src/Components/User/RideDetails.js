import React from 'react';

const RideDetails = ({ price, waitTime, onConfirm }) => {
  return (
    <div>
      <p>Price: {price} RSD</p>
      <p>Waiting time: {waitTime} minutes</p>
      <button onClick={onConfirm}>Confirm</button>
    </div>
  );
};

export default RideDetails;
