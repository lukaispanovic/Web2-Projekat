import React from 'react';

const AdminRideList = ({ rides }) => {
  return (
    <div>
      <h3>All rides</h3>
      <ul>
        {rides.map((ride, index) => (
          <li key={index}>
            Od: {ride.startAddress} Do: {ride.endAddress} Cena: {ride.price} RSD Vreme čekanja: {ride.waitTime} minuta Status: {ride.accepted ? (ride.completed ? 'Završena' : 'Prihvaćena') : 'Čeka na prihvatanje'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminRideList;
