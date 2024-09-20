import React, { useState, useEffect } from 'react';
import { GetDrivers } from "../../Services/UserService";
import { getRides } from "../../Services/RideService";
import { BlockUser } from "../../Services/UserService";
import AdminRideList from "./AdminRideList";
import "../Styles/AdminStyle.css";
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
        return response.data;
      } catch (error) {
        console.error('Failed to fetch drivers:', error);
      }
    };

    const fetchRides = async () => {
      try {
        const tokenS = localStorage.getItem('encodedToken');
        const token = tokenS ? JSON.parse(tokenS) : null;
        const response = await getRides(0, token);
        setRides(response.data);
        return response.data;
      } catch (error) {
        console.error('Failed to fetch rides:', error);
      }
    };

    const calculateScore = (drivers, rides) => {
      const driverScores = drivers.map(driver => {
        const driverRides = rides.filter(ride => ride.driverId === driver.id);
        const ratedRides = driverRides.filter(ride => ride.reviewScore > 0);
        
        const totalRating = ratedRides.reduce((sum, ride) => sum + ride.reviewScore, 0);
        const numberOfRatedRides = ratedRides.length;
        const averageRating = numberOfRatedRides > 0 ? totalRating / numberOfRatedRides : 0;

        const score = parseFloat(averageRating.toFixed(2));

        return {
          ...driver,
          score: score,
        };
      });

      setDriversWScore(driverScores);
    };

    const fetchData = async () => {
      const fetchedDrivers = await fetchDrivers();
      const fetchedRides = await fetchRides();
      if (fetchedDrivers && fetchedRides) {
        calculateScore(fetchedDrivers, fetchedRides);
      }
    };

    fetchData();

    const intervalId = setInterval(fetchData, 15000);

    return () => clearInterval(intervalId);
  }, []);

  const handleBlockUser = async (username, isBlocked) => {
    const v = !isBlocked; // Toggle block status
    try {
      const response = await BlockUser(username, v);
      if (response.status === 200) {
        console.log(`User ${username} ${isBlocked ? 'unblocked' : 'blocked'} successfully.`);
        const updatedDrivers = await GetDrivers();
        setDrivers(updatedDrivers.data);
      } else {
        console.error('Failed to block/unblock user:', response);
      }
    } catch (error) {
      console.error('Error blocking/unblocking user:', error);
    }
  };

  return (
    <div className="admin-panel-container">
      <h3 className="admin-panel-title">Admin Panel</h3>
      <h4>Verified drivers:</h4>
      <ul className="driver-list">
        {drivers.filter(driver => driver.verified === true).map((driver, index) => {
          const scoreData = driversWScore.find(score => score.id === driver.id);
          const averageScore = scoreData ? scoreData.score : 'No rating';

          return (
            <li className="driver-list-item" key={index}>
              {driver.name} - Average rating: {averageScore}
              <button className={driver.blocked ? 'unblock-button' : 'block-button'} onClick={() => handleBlockUser(driver.username, driver.blocked)}>
                {driver.blocked ? 'Unblock' : 'Block'}
              </button>
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
