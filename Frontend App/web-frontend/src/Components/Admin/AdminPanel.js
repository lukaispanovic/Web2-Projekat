import React, { useState, useEffect } from 'react';
import { GetDrivers } from "../../Services/UserService";
import { getRides } from "../../Services/RideService";
import AdminRideList from "./AdminRideList";
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
  
    const fetchRides = async () => {
      try {
        const response = await getRides();
        setRides(response.data); 
      } catch (error) {
        console.error('Failed to fetch rides:', error);
      }
    };
  
    const calculateScore = () => {
      const driverScores = drivers.map(driver => {
        const driverRides = rides.filter(ride => ride.driverId === driver.id);
        
        const totalRating = driverRides.reduce((sum, ride) => sum + (ride.reviewScore || 0), 0);
        const numberOfRides = driverRides.length;
        const averageRating = numberOfRides > 0 ? totalRating / numberOfRides : 0;
  
        const score = averageRating * numberOfRides; 
        
        return {
          ...driver,
          score: score,
        };
      });
  
      setDriversWScore(driverScores);
    };
    

    fetchDrivers().then(fetchRides).then(calculateScore);
  
  }, []); 
  
  return (

    <div>
      <h3>Admin Panel</h3>
      <ul>
        {drivers.map((driver, index) => (
          <li key={index}>
            {driver.name} - Average rating: {driver.score}
          </li>
        ))}
      </ul>
      <h4>Verified drivers:</h4>
      <ul>
        {drivers.filter(driver => driver.verified === true).map((driver, index) => {
        const scoreData = driversWScore.find(score => score.driverId === driver.id);
        const averageScore = scoreData ? scoreData.score : 'No rating';

        return (
        <li key={index}>
        {driver.name} - Average rating: {averageScore}
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
