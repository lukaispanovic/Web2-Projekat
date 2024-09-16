import React, { useState, useEffect } from 'react';
import { GetDrivers } from "../../Services/UserService";
import Header from "../Header";

const AdminPanel = () => {

  const [drivers, setDrivers] = useState([]);
  const [rides, setRides] = useState([]);
  const [driversWScore, setDriversWScore] = useState([]);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const response = await GetDrivers();
        setDrivers(response.data);
      } catch (error) {
        console.error('Failed to fetch drivers:', error);
      }
    }; 
  }, []); 
  
  return (

    <div>
      <h3>Admin Panel</h3>
      <ul>
        {drivers.map((driver, index) => (
          <li key={index}>
            {driver.name} - Prosečna ocena: {driver.score}
          </li>
        ))}
      </ul>
      <h4>Odobreni vozači:</h4>
      <ul>
        {drivers.filter(driver => driver.verified === true).map((driver, index) => {
        const scoreData = driversWScore.find(score => score.driverId === driver.id);
        const averageScore = scoreData ? scoreData.score : 'No rating';

        return (
        <li key={index}>
        {driver.name} - Prosečna ocena: {averageScore}
      </li>
    );
  })}
</ul>

      <div>
        <AdminRideList rides={rides} />
      </div>
    </div>
  );
};

export default AdminPanel;