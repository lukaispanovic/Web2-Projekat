import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Login from "./Components/Login";
import Register from "./Components/Register"
import Profile from './Components/Profile';
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
        <Route path='/home/profile' element={<Profile/>} />
        </Routes>
      </header>
      </div>
    </div>
  );
}

export default App;
