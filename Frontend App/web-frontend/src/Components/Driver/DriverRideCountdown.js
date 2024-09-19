import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { isDriverAtRide } from '../../Services/RideService';

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
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "1.5rem", backgroundColor: "#192339" }}>
      <div style={{ color: "#e2e8f0", textAlign: "center" }}>
        {ride.waitingTime > 0 ? (
          <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>Picking up passenger</h1>
        ) : (
          <h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>Driving</h2>
        )}
        <div className="driver-countdown-component">
          <div className="countdown-timers">
            <div>
              <h2>Wait Duration: {ride.waitingTime}</h2>
            </div>
            <div>
              <h2>Ride Duration: {ride.travelTime}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DriverRideCountdown;
