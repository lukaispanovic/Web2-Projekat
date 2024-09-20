import React from 'react';
import "../Styles/UserStyle.css";

const RideDetails = ({ price, waitTime, onConfirm }) => {
  return (
    <div className="user-container">
      <p>Price: {price} RSD</p>
      <p>Waiting time: {waitTime} minutes</p>
      <button className="user-button" onClick={onConfirm}>Confirm</button>
    </div>
  );
};

export default RideDetails;
