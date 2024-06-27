import React, { useState } from "react";
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import "./Signup.css";
import Header from "../../components/homepage/Header";
import { Link, useNavigate, useLocation} from 'react-router-dom';

const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mobile, setMobile] = useState("");
  const [emailError, setEmailError] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [serverError, setServerError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();

  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(String(email).toLowerCase());
  };

  const validateMobile = (mobile) => {
    const re = /^[789]\d{9}$/;
    return re.test(String(mobile));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;

    if (!validateEmail(email)) {
      setEmailError("Invalid email address");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!validateMobile(mobile)) {
      setMobileError("Invalid mobile number");
      valid = false;
    } else {
      setMobileError("");
    }

    if (valid) {
      const formData = { firstName, lastName, email, password, mobileNo:mobile };

      try {
        const response = await axios.post('http://localhost:3000/submit-signup', formData);
        alert(response.data);

        const redirectTo = location.state?.from || '/login';
        navigate(redirectTo);
      } catch (error) {
        console.error('Error:', error);
        if (error.response && error.response.status === 401) {
          setServerError('Invalid email or password');
        } else {
          setServerError('An error occurred. Please try again.');
        }
      }
    }
  };

  return (
    <div>
      <Header />
      <div className="signup-container">
        <div className="signup-form">
          <h2>Sign Up</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="firstName">First Name</label>
              <input
                type="text"
                className="form-control"
                id="firstName"
                placeholder="Enter first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name</label>
              <input
                type="text"
                className="form-control"
                id="lastname"
                placeholder="Enter last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label htmlFor="mobile">Mobile Number</label>
              <input
                type="text"
                className={`form-control ${mobileError ? "is-invalid" : ""}`}
                id="mobile"
                placeholder="Enter mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
              {mobileError && (
                <div className="invalid-feedback">{mobileError}</div>
              )}
            </div>
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
            <button type="submit" className="btn btn-primary">
              Sign Up
            </button>
          </form>
          <p className="mt-3">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
