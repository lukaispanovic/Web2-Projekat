import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { isUserAtRide, writeReview, finishRide } from '../../Services/RideService';
import CreateRating from "./CreateRating";

const RideCountdown = () => {
  const navigate = useNavigate();
  const [ride, setRide] = useState({
    id: 0,
    waitingTime: 0,
    travelTime: 0,
    rideStatus: 1,
  });
  const intervalRef = useRef(null);
  const [rew, setRew] = useState(false);

  const onSubmitRating = async (rating) =>{
    const encodedToken = JSON.parse(localStorage.getItem('encodedToken'));
    const reviewResponse = await writeReview(ride.id, rating, encodedToken);

    if (reviewResponse.status === 200) {
      toast.success("Rating submitted successfully!");
      navigate("/home/profile");
    } else {
      toast.error("Failed to submit rating.");
    }
  }

  const startCountdown = useCallback(() => {
    const countdownInterval = setInterval(() => {
      setRide(prevRide => {
        if (prevRide.waitingTime > 0) {
          return { ...prevRide, waitingTime: prevRide.waitingTime - 1 };
        } else if (prevRide.travelTime > 0) {
          return { ...prevRide, travelTime: prevRide.travelTime - 1 };
        } else {
          clearInterval(countdownInterval);
          finishRidee();
          return prevRide;
        }
      });
    }, 1000);
  }, [ride.id]);

  const finishRidee = async () => {
    const tokenS = localStorage.getItem('encodedToken');
    const token2 = tokenS ? JSON.parse(tokenS) : null;
    console.log(ride.id);
    const response = await finishRide(ride.id, token2);

    if (response.status === 200) {
      toast.success("Ride finished successfully!");
      localStorage.setItem('inProgress', false);
      setRew(true);
    } else {
      toast.error("Failed to finish the ride.");
    }
  };

  useEffect(() => {
    if(localStorage.getItem('inProgress') === false){
      navigate("/home/profile");
    }
    const checkRideStatus = async () => {
      const token = JSON.parse(localStorage.getItem('token'));
      const encodedToken = JSON.parse(localStorage.getItem('encodedToken'));
      const status = await isUserAtRide(token.id, encodedToken);

      setRide(status);
      if(status.rideStatus === 2){
        localStorage.setItem('inProgress', false);
        navigate("/home/profile");
      }

      if (status.rideStatus === 0) {
        clearInterval(intervalRef.current); 
        startCountdown(); 
      }
    };

    intervalRef.current = setInterval(checkRideStatus, 3000);

    return () => clearInterval(intervalRef.current);
  }, [startCountdown]);

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "1.5rem", backgroundColor: "#192339" }}>
       { !rew? (<div style={{ color: "#e2e8f0", textAlign: "center" }}>
          {ride.travelTime? (<h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>Waiting for Your Ride</h2>)
          :(<h2 style={{ fontSize: "1.5rem", fontWeight: "bold", marginBottom: "1rem" }}>Riding</h2>)}
          <p>Your ride is not finished</p>
          <div className="user-countdown-component">
            <h1>Countdown Timer</h1>
            <div className="countdown-timers">
          <div>
              <h2>Wait Duration: {ride.waitingTime}</h2>
          </div>
          <div>
            <h2>Ride Duration: {ride.travelTime}</h2>
          </div>
        </div>
    </div>
        </div>) : (<CreateRating onSubmitRating = {onSubmitRating}/>) }
        
    </div>
  );

};

export default RideCountdown;
