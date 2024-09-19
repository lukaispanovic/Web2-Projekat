import React, { useState, useEffect } from "react";
import { getRides, writeReview } from "../../Services/RideService";
import { toast } from "react-toastify";

const PreviousRides = () => {
  const [rideHistory, setRideHistory] = useState([]);
  const [selectedRating, setSelectedRating] = useState({});

  const fetchRideHistory = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('token'));
      const tokenS = localStorage.getItem('encodedToken');
      const token2 = tokenS ? JSON.parse(tokenS) : null;

      const history = await getRides(token.id, token2);
      console.log("Ride History:", history);
      setRideHistory(history.data);
    } catch (error) {
      console.error("Error fetching ride history:", error);
    }
  };

  useEffect(() => {
    fetchRideHistory();
  }, []);

  const onSubmitRating = async (rideId) => {
    const rating = selectedRating[rideId];
    if (!rating) {
      toast.error("Please select a rating.");
      return;
    }

    const encodedToken = JSON.parse(localStorage.getItem('encodedToken'));
    const reviewResponse = await writeReview(rideId, rating, encodedToken);

    if (reviewResponse.status === 200) {
      toast.success("Rating submitted successfully!");
      fetchRideHistory();
    } else {
      toast.error("Failed to submit rating.");
    }
  };

  return (
    <div id="historyComponent">
      <h2>My ride history</h2>
      {rideHistory.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Id</th>
              <th>Start Address</th>
              <th>End Address</th>
              <th>Wait Time</th>
              <th>Travel Time</th>
              <th>Price</th>
              <th>Rate</th>
            </tr>
          </thead>
          <tbody>
            {rideHistory.map((ride) => (
              <tr key={ride.id}>
                <td>{ride.id}</td>
                <td>{ride.startAddress}</td>
                <td>{ride.endAddress}</td>
                <td>{ride.waitingTime}</td>
                <td>{ride.travelTime}</td>
                <td>{ride.price}</td>
                <td>
                  {ride.reviewScore === 0 ? (
                    <div>
                      <select
                        value={selectedRating[ride.id] || ""}
                        onChange={(e) => setSelectedRating({ ...selectedRating, [ride.id]: e.target.value })}
                      >
                        <option value="" disabled>Select rating</option>
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <option key={rating} value={rating}>{rating}</option>
                        ))}
                      </select>
                      <button onClick={() => onSubmitRating(ride.id)}>Submit Rating</button>
                    </div>
                  ) : (
                    <span>Rated: {ride.reviewScore}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No ride history available.</p>
      )}
    </div>
  );
};

export default PreviousRides;
