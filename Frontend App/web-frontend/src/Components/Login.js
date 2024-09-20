import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button } from "react-bootstrap";
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.css';
import { LoginUser } from "../Services/UserService";
import "./Styles/LoginRegisterStyle.css";

function Login(){
    const [errorMessages, setErrorMessages] = useState({});
    const navigate = useNavigate();

    const renderErrorMessage = (name) =>
    name === errorMessages.name && (
        <div style={{ color: 'red', fontSize: '15px' }}>{errorMessages.message}</div>
    );

    function validate(event)
    {
        var valid = true;
        if(event.target.username.value.trim()==="")
        {
            valid = false;
            setErrorMessages({ name: "username", message: "Username is required!" });
        }
        if(event.target.password.value.trim()==="")
        {
            valid = false;
            setErrorMessages({ name: "password", message: "Password is required!" });
        }
        return valid;
    }
    
    const login = async(data) =>
    {
        const x = await LoginUser(data);
        if(x && x.status === 200)
            navigate('/home/profile');
    }

    const handleSubmit = (event) =>
        {
            event.preventDefault();
            setErrorMessages({ name: "username", message: "" })
            setErrorMessages({ name: "password", message: "" })
            if(validate(event))
            {
                var formData = new FormData();
                const u = event.target.username.value;
                formData.append("username",u);
                formData.append("password",event.target.password.value);
                login(formData);
            }
        }
        return (
            <div className="container mt-5 ">
            <div className="row justify-content-center">
              <div className="col-md-6">
                <Form onSubmit={handleSubmit} className="bg-light border border-gray rounded">
                  <div className="card">
                    <div className="card-body">
                      <h3 className="card-title">Login</h3>
                      <Form.Group controlId="username">
                        <Form.Label>Username</Form.Label>
                        <Form.Control type="text" name="username"/>
                        {renderErrorMessage("username")}
                      </Form.Group>
                      <Form.Group controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" name="password"/>
                        {renderErrorMessage("password")}
                      </Form.Group>
                      <Form.Group>
                        <Button variant="success" type="submit" className="mt-2">
                          Login
                        </Button>
                      </Form.Group>
                      <div>
                        Don't have an account? Go to{" "}
                        <a href="/register" className="link-dark">
                          Registration
                        </a>
                      </div>
                      <br/>
                    </div>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        )
    }
    
    export default Login;