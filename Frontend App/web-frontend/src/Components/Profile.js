import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Form, Button } from 'react-bootstrap';
import "./Styles/ProfileStyle.css";
import { User, getUserFromLocalStorage } from "../DataModel/User";
import { EditProfile, FetchPFP } from "../Services/UserService";
import axios from "axios";

function Profile()
{
    const [errorMessages, setErrorMessages] = useState({});
    const [file, setFile] = useState(null);
    const [image, setImage] = useState(null);
    const [name,setName] = useState('');
    const [username,setUsername] = useState('');
    const [surname,setSurname] = useState('');
    const [email,setEmail] = useState('');
    const [date,setDate]  = useState('');
    const [address,setAddress] = useState('');
    const [userType,setUserType] = useState('');
    const[formData,setFormData]=useState('');
    const nav = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = getUserFromLocalStorage();
                setUserType(userData.Role());
                setName(userData.name);
                setUsername(userData.username);
                setAddress(userData.address);
                const birthday = userData.birthday.substring(0, 10);
                setDate(birthday);
                setSurname(userData.surname);
                setEmail(userData.email);
                const filename = userData.profilePictureUrl;
                const base64Image = await FetchPFP(filename);
                setImage(`${base64Image}`);
            } catch (error) {
                console.error('Error fetching user data or profile picture:', error);
            }
        };
        fetchUserData();
    }, []);

    const renderErrorMessage = (name) =>
        name === errorMessages.name && (
            <div style={{ color: 'red', fontSize: '15px' }}>{errorMessages.message}</div>
        );

    function validate(event) {
        var valid = true;
        const username = event.target.username.value;
        const email = event.target.email.value;
        const name = event.target.name.value;
        const surname = event.target.surname.value;
        const date = event.target.date.value;
        const address = event.target.address.value;

        if (username.trim() === "") {
            setErrorMessages({ name: "username", message: "Username is required!" });
            valid = false;
        }
        if (email.trim() === "") {
            setErrorMessages({ name: "email", message: "Email is required!" });
            valid = false;
        }
        if (name.trim() === "") {
            setErrorMessages({ name: "name", message: "Name is required!" });
            valid = false;
        }
        if (surname.trim() === "") {
            setErrorMessages({ name: "surname", message: "Surname is required!" });
            valid = false;
        }
        
        if (address.trim() === "") {
            setErrorMessages({ name: "address", message: "Address is required!" });
            valid = false;
        }
        if (!date) {
            setErrorMessages({ name: "date", message: "Date of birth is required!" });
            valid = false;
        }
        const y = new Date(date).getFullYear();

        if (y > 2020 || y < 1900) {
            setErrorMessages({ name: "date", message: "Date is out of bounds!" });
            valid = false;
        }
        return valid;


    }

    const sendData = async(data) =>{
      const resp = await EditProfile(data);
      if(resp.status === 200)
      {
        toast.success('Succesful edit of profile!');
      }
      else {
        console.log('error');
        toast.error('Failed to update data!');
      }
    }

    function handleSubmit(event) {
        event.preventDefault();
        setErrorMessages({ name: "username", message: "" })
        setErrorMessages({ name: "email", message: "" })
        setErrorMessages({ name: "name", message: "" })
        setErrorMessages({ name: "surname", message: "" })
        setErrorMessages({ name: "date", message: "" })
        setErrorMessages({ name: "address", message: "" })
        if (validate(event)) {
            const formData = new FormData();
            formData.append('username', event.target.username.value);
            formData.append('name', event.target.name.value);
            formData.append('surname', event.target.surname.value);
            formData.append('birthday', event.target.date.value);
            formData.append('email', event.target.email.value);
            formData.append('address', event.target.address.value);
            formData.append('usertype', userType);
            formData.append('file', file);

            sendData(formData);
        }
    }
    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
        let value = URL.createObjectURL(event.target.files[0]);
        setImage(value);
    };
    const handleNameChange = (event) => {
        setName(event.target.value);
    };
    const handleSurnameChange = (event) => {
        setSurname(event.target.value);
    };
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };
    const handleDateChange = (event) => {
        setDate(event.target.value);
    };
    const handleAddressChange = (event) => {
        setAddress(event.target.value);
    };
    return(
        <Form onSubmit={handleSubmit} id="form">
        <div className="d-flex justify-content-center align-items-center mt-2">
          <div className="d-flex flex-column border border-gray rounded p-3 w-400px m-200px bg-light">
            <div className="m-2">
              <Form.Label>Username</Form.Label>
              <Form.Control readOnly type="text" name="username" defaultValue={username} />
              {renderErrorMessage("username")}
            </div>
            <div className="m-2">
              <Form.Label>Email</Form.Label>
              <Form.Control readOnly type="text" name="email" defaultValue={email} />
              {renderErrorMessage("email")}
            </div>
            <div className="m-2">
              <Form.Label>Name</Form.Label>
              <Form.Control type="text" name="name" defaultValue={name} onChange={handleNameChange} />
              {renderErrorMessage("name")}
            </div>
            <div className="m-2">
              <Form.Label>Surname</Form.Label>
              <Form.Control type="text" name="surname" defaultValue={surname} onChange={handleSurnameChange} />
              {renderErrorMessage("surname")}
            </div>
            <div className="m-2">
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control type="date" name="date" defaultValue={date} onChange={handleDateChange} />
              {renderErrorMessage("date")}
            </div>
            <div className="m-2">
              <Form.Label>Address</Form.Label>
              <Form.Control type="text" name="address" defaultValue={address} onChange={handleAddressChange} />
              {renderErrorMessage("address")}
            </div>
            <div className="m-2">
                <img name="picture" src={image} width="150px" height="150px" alt="Profile" />
            </div>
            <div className="m-2">
              <Form.Label>Profile Picture</Form.Label>
              <Form.Control type="file" name="image" accept=".jpg,.jpeg,.png" onChange={handleFileChange} />
            </div>
            <div className="m-2">
              <Button variant="success" type="submit" >Save</Button>
            </div>
          </div>
        </div>
      </Form>
    );
}
export default Profile;