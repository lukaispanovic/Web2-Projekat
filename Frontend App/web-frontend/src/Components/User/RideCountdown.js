import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { isUserAtRide, finishRide } from '../../Services/RideService';
import "../Styles/UserStyle.css";

const RideCountdown = () => {
  const navigate = useNavigate();
  const [ride, setRide] = useState({
    id: 0,
    waitingTime: 0,
    travelTime: 0,
    rideStatus: 1,
  });
  const [checkingRideStatus, setCheckingRideStatus] = useState(true);
  const intervalRef = useRef(null);
  const countdownRef = useRef(null);

  const startCountdown = useCallback(() => {
    countdownRef.current = setInterval(() => {
      setRide(prevRide => {
        let updatedWaitingTime = prevRide.waitingTime;
        let updatedTravelTime = prevRide.travelTime;

        if (updatedWaitingTime > 0) {
          updatedWaitingTime -= 1;
          localStorage.setItem('waitingTime', updatedWaitingTime);
        } else if (updatedTravelTime > 0) {
          updatedTravelTime -= 1;
          localStorage.setItem('travelTime', updatedTravelTime);
        } else {
          clearInterval(countdownRef.current);
          finishRidee();
        }

        return {
          ...prevRide,
          waitingTime: updatedWaitingTime,
          travelTime: updatedTravelTime,
        };
      });
    }, 1000);
  }, []);

  const finishRidee = async () => {
    const tokenS = localStorage.getItem('encodedToken');
    const token2 = tokenS ? JSON.parse(tokenS) : null;
    const response = await finishRide(parseInt(localStorage.getItem('rideId'), 10), token2);

    if (response.status === 200) {
      toast.success("Ride finished successfully!");
      localStorage.setItem("waitingTime", -1);
      localStorage.setItem("travelTime", -1);
      localStorage.setItem("rideStatus", -1);
      localStorage.setItem("rideId", -1);
      localStorage.setItem('inProgress', 'false');
      navigate("/home/previousRides");
    } else {
      toast.error("Failed to finish the ride.");
    }
  };

  useEffect(() => {
    if (localStorage.getItem('inProgress') === 'false') {
      navigate("/home/previousRides");
    }

    if(localStorage.getItem('waitingTime') === null){
      localStorage.setItem('waitingTime', -1);
    }
    const waitingTime = parseInt(localStorage.getItem('waitingTime'), 10);
    if(localStorage.getItem('travelTime') === null){
      localStorage.setItem('travelTime', -1);
    }
    const travelTime = parseInt(localStorage.getItem('travelTime'), 10);
    if(localStorage.getItem('rideStatus') === null){
      localStorage.setItem('rideStatus', -1);
    }
    const rideStatus = parseInt(localStorage.getItem('rideStatus'), 10);

    if (waitingTime === -1 || travelTime === -1 || rideStatus === -1) {
      const checkRideStatus = async () => {
        const token = JSON.parse(localStorage.getItem('token'));
        const encodedToken = JSON.parse(localStorage.getItem('encodedToken'));
        const status = await isUserAtRide(token.id, encodedToken);

        setRide(status);
        localStorage.setItem('waitingTime', status.waitingTime);
        localStorage.setItem('travelTime', status.travelTime);
        localStorage.setItem('rideStatus', status.rideStatus);
        localStorage.setItem('rideId', status.id)

        if (status.rideStatus === 2) {
          localStorage.setItem('inProgress', 'false');
          navigate("/home/previousRides");
        }

        if (status.rideStatus === 0) {
          clearInterval(intervalRef.current);
          setCheckingRideStatus(false);
        }
      };

      intervalRef.current = setInterval(checkRideStatus, 3000);

    } else {

      setRide({
        id: ride.id,
        waitingTime: waitingTime,
        travelTime: travelTime,
        rideStatus: rideStatus,
      });

      if (rideStatus === 0) {
        startCountdown(); 
      }
    }

    return () => {
      clearInterval(intervalRef.current);
      clearInterval(countdownRef.current);
    };
  }, [checkingRideStatus, startCountdown]);

  useEffect(() => {
    if (ride.rideStatus === 0 && !countdownRef.current) {
      startCountdown();
    }
  }, [ride.rideStatus, startCountdown]);

  return (
    <div className="user-container" style={{ backgroundColor: "#192339", color: "#e2e8f0" }}>
      <div style={{ color: "#e2e8f0", textAlign: "center" }}>
        {ride.rideStatus === 1 ? (
          <>
            <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>
              Waiting for Driver to Accept Ride
            </h1>
            <div className="user-countdown-component">
              <div className="countdown-timers">
                <div>
                  <h2>Wait Duration: TBD</h2>
                </div>
                <div>
                  <h2>Ride Duration: {ride.travelTime}</h2>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {ride.waitingTime > 0 ? (
              <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>
                Waiting for Your Ride
              </h1>
            ) : (
              <h1 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>
                Riding
              </h1>
            )}
            <div className="user-countdown-component">
              <div className="countdown-timers">
                <div>
                  <h2>Wait Duration: {ride.waitingTime}</h2>
                </div>
                <div>
                  <h2>Ride Duration: {ride.travelTime}</h2>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default RideCountdown;
