import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { isDriverAtRide } from '../../Services/RideService';
import "../Styles/DriverStyle.css";

const DriverRideCountdown = () => {
  const navigate = useNavigate();
  const [ride, setRide] = useState({
    id: 0,
    waitingTime: 0,
    travelTime: 0,
    rideStatus: 0,
  });
  const intervalRef = useRef(null);
  const statusCheckRef = useRef(null);

  const startCountdown = useCallback(() => {
    const countdownInterval = setInterval(() => {
      setRide(prevRide => {
        if (prevRide.waitingTime > 0) {
          return { ...prevRide, waitingTime: prevRide.waitingTime - 1 };
        } else if (prevRide.travelTime > 0) {
          return { ...prevRide, travelTime: prevRide.travelTime - 1 };
        } else {
          clearInterval(countdownInterval);
          finishRide();
          return prevRide;
        }
      });
    }, 1000);

    intervalRef.current = countdownInterval;
  }, []);

  const finishRide = async () => {
    toast.success("Ride finished successfully!");
    localStorage.setItem('inProgress', 'false');
    navigate("/home/Driver/newRides");
  };

  useEffect(() => {
    const checkRideStatus = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('token'));
        const encodedToken = JSON.parse(localStorage.getItem('encodedToken'));
        const status = await isDriverAtRide(token.id, encodedToken);

        if (status.rideStatus === 2) {
          localStorage.setItem('inProgress', 'false');
          navigate("/home/Driver/newRides");
          if (statusCheckRef.current) {
            clearInterval(statusCheckRef.current);
          }
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
        } else if (status.rideStatus === 0) {
          setRide(status);
          if (!intervalRef.current) {
            startCountdown();
          }
          if (statusCheckRef.current) {
            clearInterval(statusCheckRef.current);
          }
        } else {
          console.log("Ride status:", status.rideStatus);
        }
      } catch (error) {
        console.error("Error fetching ride status:", error);
        toast.error("Failed to fetch ride status");
      }
    };

    checkRideStatus();

    statusCheckRef.current = setInterval(checkRideStatus, 3000);

    return () => {
      if (statusCheckRef.current) {
        clearInterval(statusCheckRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startCountdown, navigate]);

  return (
    <div className="ride-countdown-container">
      <div>
        <h1 className="ride-countdown-title">
          {ride.waitingTime > 0 ? "Picking up passenger" : "Driving"}
        </h1>
        <div className="countdown-timers">
          <div className="countdown-timer">
            <h2>Wait Duration: {ride.waitingTime}</h2>
          </div>
          <div className="countdown-timer">
            <h2>Ride Duration: {ride.travelTime}</h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverRideCountdown;
