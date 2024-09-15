import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { User } from "../DataModel/User";
import { jwtDecode } from "jwt-decode";

function decodeToken(token){
    try{
        const decoded = jwtDecode(token);
        return decoded;
    }catch(error){
        console.error("Cannot decode token: ", error);
        return null;
    }
}

const handleApiError = (error) => {
    const errorMessage = error.response?.data || error.message;
    toast.error(errorMessage);
    return errorMessage;
}

export const LoginUser = async (data) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/user/login`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if(response.status === 200){
        const decodedToken = decodeToken(response.data.token);
  
        const user = User.fromObject(response.data.user);
        localStorage.setItem('encodedToken', JSON.stringify(response.data.token));
        localStorage.setItem('token', JSON.stringify(decodedToken));
        localStorage.setItem('user', JSON.stringify(user));
        return response;
        }
      else {
        toast.error('User not found!');
        return response;
      }
    } catch (error) {
      return handleApiError(error);
    }
  };

  export const RegisterUser = async (data) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/user/register`, data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      if(response.status === 200){
        const decodedToken = decodeToken(response.data.token);
  
        const user = User.fromObject(response.data.user);
  
        localStorage.setItem('encodedToken', JSON.stringify(response.data.token));
        localStorage.setItem('token', JSON.stringify(decodedToken));
        localStorage.setItem('user', JSON.stringify(user));
        return response;
        }
      return response;
    } catch (error) {
      return handleApiError(error);
    }
  };

  export const EditProfile = async (data) => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_API_URL}/api/user/updateProfile`, data);
      return response;
    } catch (error) {
      return handleApiError(error);
    }
  };

  export const FetchPFP = async (filename) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/user/getPfPFromUserId`, {
        params: { filename },
      });
      return response.data;
    } catch (error) {
      return handleApiError(error);
    }
  };