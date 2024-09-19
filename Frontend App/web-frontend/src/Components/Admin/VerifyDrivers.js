import React, { useState, useEffect } from "react";
import { GetDrivers, VerifyUser } from "../../Services/UserService";

const VerifyDrivers = () => {
    const [usersForVerification, setUsersForVerification] = useState([]);
  
    const fetchUsersForVerification = async () => {
      try {
        const drivers = await GetDrivers();
        console.log("drivers for Verification:", drivers.data); 
        setUsersForVerification(drivers.data);
      } catch (error) {
        console.error("Error fetching drivers for verification:", error);
        setUsersForVerification([]); 
      } 
    };
  
    const verifyUser = async (userId, v) => {
      try {
        await VerifyUser(userId, v);
        fetchUsersForVerification(); 
      } catch (error) {
        console.error("Error verifying driver:", error);
      }
    };
  
  
    useEffect(() => {
      fetchUsersForVerification();
    }, []);
  
    return (
      <div id="historyComponent">
        <h2>Driver Verification</h2>
       {usersForVerification.length > 0 ? (   <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Name</th>
                <th>Surname</th>
                <th>Email</th>
                <th>Date of Birth</th>
                <th>Address</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {usersForVerification.map((user) => (
                <tr key={user.email}>
                  <td>{user.username}</td>
                  <td>{user.name}</td>
                  <td>{user.surname}</td>
                  <td>{user.email}</td>
                  <td>{new Date(user.birthday).toLocaleDateString()}</td>
                  <td>{user.address}</td>
                  <td>
                  {!user.verified ? (
                  <button onClick={() => verifyUser(user.username, true)}>Verify</button>
                ) : (
                  <button onClick={() => verifyUser(user.username, false)}>Deny</button>
                )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No users awaiting verification.</p>
        )}
      </div>
    );
  };
  
  export default VerifyDrivers;