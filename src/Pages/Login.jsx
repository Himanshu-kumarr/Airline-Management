import React, { useState } from "react";
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import "./Login.css";
import Header from "../../components/homepage/Header";
import { useNavigate, useLocation } from 'react-router-dom';

const Login = ({setUserDetail, setIsLoggedIn}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [serverError, setServerError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError("Invalid email address");
      return;
    }
    setEmailError("");
    setServerError("");

    const formData = { email, password };

    try {
      const response = await axios.post('http://localhost:3000/submit-login', formData);
      // alert(response.data);

      const user = response.data;

      if (response.status === 200) {     
          setIsLoggedIn(true);
          setUserDetail({id:user.id, firstName:user.firstName, lastName:user.lastName,email:user.email,mobileNo:user.mobileNo});
          
          const redirectTo = location.state?.from || '/';
          navigate(redirectTo);
      } else {
        setServerError('Invalid email or password');
      }
    } catch (error) {
      console.error('Error:', error);
      if (error.response && error.response.status === 401) {
        setServerError('Invalid email or password');
      } else {
        setServerError('An error occurred. Please try again.');
      }
    }
  };

  const handleGoToRegister = () => {
    const currentLocation = location.state?.from || '/';
    navigate('/signUp', { state: { from: currentLocation } });
  };

  

  return (
    <div>
      <Header />
      <div className="login-container">
        <div className="login-form">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                className={`form-control ${emailError ? "is-invalid" : ""}`}
                id="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {emailError && (
                <div className="invalid-feedback">{emailError}</div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            {serverError && (
              <div className="alert alert-danger mt-3" role="alert">
                {serverError}
              </div>
            )}
            <button type="submit" className="btn btn-primary" >

              Login
            </button>
          </form>
          <p className="mt-3">
            Don't have an account? <a onClick={handleGoToRegister} href="/signup">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
