import logo from './logo.svg';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Login from "./Components/Login";
import Register from "./Components/Register"
import Profile from './Components/Profile';
import HomePage from './HomePage';
import PrivateRoute from './Components/PrivateRoute';
import Unauthorized from './Components/Unauthorized';
import VerifyDrivers from './Components/Admin/VerifyDrivers';
import AdminPanel from './Components/Admin/AdminPanel';
import PreviousRides from './Components/User/PreviousRides';
import NewRide from './Components/User/NewRide';
import RideCountdown from './Components/User/RideCountdown';
import DriverPreviousRides from './Components/Driver/DriverPreviousRides';
import DriverNewRidesList from './Components/Driver/DriverNewRidesList';
import { ToastContainer, toast } from 'react-toastify';

function App() {
  const navigate = useNavigate();

  return (
    <div>
    <div className="App">
      <ToastContainer position='top-right' autoClose={3000}/>

      <header className="App-header">
        <Routes>
        <Route path='/' element={<Login/>}/> 
        <Route path='/login' element={<Login/>}/>
        <Route path='/register' element={<Register/>}/>
        <Route path='/unauthorized' element= {<Unauthorized/>}/>
        <Route path='/inprogress' element= {<PrivateRoute allowedRoles={['User']}><RideCountdown/></PrivateRoute>}/>
        <Route path='/home' element={<PrivateRoute allowedRoles={['Admin','User','Driver']}><HomePage/></PrivateRoute>}>
          <Route path='/home/profile' element={<Profile/>}/>
          <Route path='/home/admin/adminPanel' element={<PrivateRoute allowedRoles={['Admin']}><AdminPanel/></PrivateRoute>}/>
          <Route path='/home/admin/verifyDrivers' element={<PrivateRoute allowedRoles={['Admin']}><VerifyDrivers/></PrivateRoute>}/>
          <Route path='/home/previousRides' element={<PrivateRoute allowedRoles={['User']}><PreviousRides/></PrivateRoute>}/>
          <Route path='/home/newRide' element={<PrivateRoute allowedRoles={['User']}><NewRide/></PrivateRoute>}/>
          <Route path='/home/driver/previousRides' element={<PrivateRoute allowedRoles={['Driver']}><DriverPreviousRides/></PrivateRoute>} />
          <Route path='/home/driver/newRides' element={<PrivateRoute allowedRoles={['Driver']}><DriverNewRidesList/></PrivateRoute>} />
        </Route>
        </Routes>
      </header>
      </div>
    </div>
  );
}

export default App;
