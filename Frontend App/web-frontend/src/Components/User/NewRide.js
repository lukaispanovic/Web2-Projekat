import React, { useState, useEffect } from "react";
import { createRide } from "../../Services/RideService";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../Styles/UserStyle.css";

const NewRide = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    startAddress: "",
    endAddress: "",
    price: 0,
    travelTime: 0,
    userId: 0,
  });
  const [working, setWorking] = useState(false);
  const [priceCalculated, setPriceCalculated] = useState(false); // State to track if price is calculated
  const [priceButtonDisabled, setPriceButtonDisabled] = useState(false); // State to track if Calculate Price button is disabled

  const rideCreation = async () => {
    if (data.startAddress.trim().length < 3) {
      toast.error("Input start address!");
      return;
    }

    if (data.endAddress.trim().length < 3) {
      toast.error("Input destination!");
      return;
    }

    setWorking(true);
    const tokenS = localStorage.getItem('encodedToken');
    const token = tokenS ? JSON.parse(tokenS) : null;

    const ride = await createRide(data, token);

    if (ride.id !== 0) {
      localStorage.setItem('inProgress', true);
      navigate("/inprogress", { replace: true });
    } else {
      toast.error("Unable to order ride!");
    }

    setWorking(false);
  };

  const priceCalculation = () => {
    if (data.startAddress.trim().length < 1) {
      toast.error("Input start address!");
      return;
    }

    if (data.endAddress.trim().length < 1) {
      toast.error("Input destination!");
      return;
    }

    const price_rnd = Math.random() * (5000 - 280) + 280;
    const travel_time = Math.random() * (60 - 10) + 10;
    const token = JSON.parse(localStorage.getItem('token'));

    setData({
      ...data,
      price: Math.round(price_rnd),
      travelTime: Math.round(travel_time),
      userId: parseInt(token.id),
    });

    setPriceCalculated(true);
    setPriceButtonDisabled(true); 
  };

  useEffect(() => {
    setPriceButtonDisabled(false);
    setPriceCalculated(false);
  }, [data.startAddress, data.endAddress]);

  return (
    <div className="user-container">
      <h2>Order New Ride</h2>
      <table className="user-table">
        <tbody>
          <tr>
            <td>{data.price}</td>
            <td>RSD is your ride price</td>
          </tr>
          <tr>
            <td>{data.travelTime}</td>
            <td>sec to driver arrival</td>
          </tr>
          <tr>
            <td>
              <label>Start Address</label>
            </td>
            <td>
              <input
                placeholder="From here"
                type="text"
                value={data.startAddress}
                onChange={(e) =>
                  setData({ ...data, startAddress: e.currentTarget.value })
                }
              />
            </td>
          </tr>
          <tr>
            <td>
              <label>Destination Address</label>
            </td>
            <td>
              <input
                placeholder="To there"
                type="text"
                value={data.endAddress}
                onChange={(e) =>
                  setData({ ...data, endAddress: e.currentTarget.value })
                }
              />
            </td>
          </tr>
          <tr>
            <td>
              <button
                type="button"
                onClick={priceCalculation}
                disabled={priceButtonDisabled} // Apply the disabled state
              >
                Calculate Price
              </button>
            </td>
            <td>
              {priceCalculated && (
                <button type="button" onClick={rideCreation}>
                  Order
                </button>
              )}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default NewRide;
