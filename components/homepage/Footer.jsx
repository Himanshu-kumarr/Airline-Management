import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import './Footer.css';

const Footer = () => {
    return (
        <footer className="footer d-flex flex-wrap justify-content-between align-items-center py-3 border-top bg-primary text-white">
            <div className="col-md-4 d-flex align-items-center">
                <a href="/" className="mb-3 me-2 mb-md-0 text-white text-decoration-none lh-1">
                    <svg className="bi" width="40" height="30"><use xlinkHref="#bootstrap"></use></svg>
                </a>
                <span className="mb-3 mb-md-0">© 2024 Company, Inc</span>
            </div>
            <ul className="nav col-md-4 justify-content-end list-unstyled d-flex">
                <li className="ms-3">
                    <a className="text-white" href="https://www.instagram.com">
                        <i className="fab fa-instagram"></i>
                    </a>
                </li>
            </ul>
        </footer>
    );
};

export default Footer;