import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './ProfilePage.css';
import axios from 'axios';

function ProfilePage({ isLoggedIn, userDetail }) {
    const [bookedFlights, setBookedFlights] = useState([]);
    
    useEffect(() => {
        async function fetchBookedFlights() {
            try {
                const response = await axios.post('http://localhost:3000/getFlightsBooked', { userDetail });
                setBookedFlights(Array.isArray(response.data) ? response.data : []);
            } catch (error) {
                console.error('Error:', error);
            }
        }

        if (isLoggedIn) {
            fetchBookedFlights();
        }
    }, [isLoggedIn, userDetail]);

    const rCityMap = {
        'BOM': 'Mumbai', 'DEL': 'Delhi', 'BLR': 'Bangalore', 'HYD': 'Hyderabad', 'AMD': 'Ahmedabad',
        'MAA': 'Chennai', 'CCU': 'Kolkata', 'STV': 'Surat', 'PNQ': 'Pune', 'JAI': 'Jaipur',
        'LKO': 'Lucknow', 'KNU': 'Kanpur', 'NAG': 'Nagpur', 'IDR': 'Indore', 'THN': 'Thane',
        'BHO': 'Bhopal', 'VTZ': 'Visakhapatnam', 'PAT': 'Patna', 'BDQ': 'Vadodara', 'GAU': 'Guwahati'
    };

    const flightNameMap = {
        'AI': 'Air India', 'IX': 'Air India Express', 'I5': 'AIX Connect', 'QP': 'Akasa Air',
        '6E': 'IndiGo', 'SG': 'SpiceJet', 'UK': 'Vistara', 'PR': 'Philippine Airlines'
    };

    return (
        <div className="py-5 my-5 search-results">
            <h2 className="px-2">Booked Flights</h2>
            {isLoggedIn && bookedFlights.length === 0 ? (
                <p>No flights booked</p>
            ) : (
                <ul className="my-4 mx-5 list-group">
                    {bookedFlights.map((flight, index) => (
                        <li key={index} className="ticket">
                            <div className="airline">
                                <h5>{flightNameMap[flight.airline]}</h5>
                            </div>
                            <div className="flight-details">
                                <div className="route">
                                    <div>
                                        <p>From</p>
                                        <p>{rCityMap[flight.source]}</p>
                                        <p>{flight.departuretime}</p>
                                        <p>Terminal: {flight.departureterminal}</p>
                                    </div>
                                    <div className="aircraft-symbol flight-icon">
                                        <img src="/takeoff-the-plane-svgrepo-com.svg" alt="Flight icon" className="flight-icon" />
                                    </div>
                                    <div>
                                        <p>To</p>
                                        <p>{rCityMap[flight.destination]}</p>
                                        <p>{flight.arrivaltime}</p>
                                        <p>Terminal: {flight.arrivalterminal}</p>
                                    </div>
                                </div>
                                
                            </div>
                            <div className="bottom-elements">
                                <div className="book-status">STATUS:<span>BOOKED</span></div>
                                <div className="price-details">
                                    <p>₹ {flight.price}</p>
                                </div>
                                <div className="details">
                                    <p>Class: {flight.flightclass}</p>
                                </div>
                            </div>
                            
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default ProfilePage;
