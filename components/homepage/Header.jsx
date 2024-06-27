import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Header.css";
import { Link } from "react-router-dom";
import userIcon from "../../public/user.svg";

const Header = ({ isLoggedIn, onLogout, setIsLoggedIn }) => {
  function Logout() {
    setIsLoggedIn(false);
  }

  return (
    <header className="container-fluid bg-light border-bottom p-3">
      <div className="d-flex flex-wrap justify-content-between align-items-center">
        <Link
          to="/"
          className="d-flex align-items-center text-dark text-decoration-none"
        >
          <img
            src="/logo4.jpg"
            alt="Logo"
            className="me-2 custom-logo"
          />
          <span className="fs-4">Fly High</span>
        </Link>

        <ul className="nav nav-pills">
          <li className="nav-item">
            <button className="himanshu">
              <Link to="/" style={{ textDecoration: "none", color: "black" }}>
                Home
              </Link>
            </button>
          </li>

          {isLoggedIn ? (
            <li className="nav-item dropdown">
              {/* Profile button */}
              <Link to="/profile">
                <button
                  className="btn btn-secondary user-profile-btn"
                  type="button"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                >
                  <img src={userIcon} alt="User" className="user-icon" />
                </button>
              </Link>

              {/* Logout button */}
              <button className="btn btn-danger logout-btn" onClick={Logout}>
                Logout
              </button>

              {/* Dropdown menu */}
              <div
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton"
              >
                <Link
                  to="/profile"
                  className="dropdown-item"
                  style={{ textDecoration: "none", color: "black" }}
                >
                  User Profile
                </Link>
              </div>
            </li>
          ) : (
            <>
              <li className="nav-item">
                <button className="himanshu">
                  <Link
                    to="/login"
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    Login
                  </Link>
                </button>
              </li>
              <li className="nav-item">
                <button className="himanshu">
                  <Link
                    to="/signup"
                    style={{ textDecoration: "none", color: "black" }}
                  >
                    SignUp
                  </Link>
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Header;
