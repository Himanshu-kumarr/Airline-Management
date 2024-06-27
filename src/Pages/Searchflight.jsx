import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Searchflight.css';
import axios from 'axios';

const Searchflight = ({isLoggedIn, userDetail}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const flightData = location.state;
  const [flights, setFlights] = useState([]);
  const [detailsVisible, setDetailsVisible] = useState({});

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

  const convertToINR = (euro) => {
    const conversionRate = 88; // Example conversion rate from EUR to INR
    return (euro * conversionRate).toFixed(2);
  };

  const formatDateTime = (dateTime) => {
    const date = new Date(dateTime);
    const options = { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' };
    return date.toLocaleString('en-IN', options);
  };

  useEffect(() => {
    const savedFlights = localStorage.getItem('flightData');
    if (flightData && flightData.data) {
      const formattedFlights = flightData.data.map((flight) => ({
        id: flight.id,
        airline: flight.itineraries[0].segments[0].carrierCode,
        source: flight.itineraries[0].segments[0].departure.iataCode,
        destination: flight.itineraries[0].segments[0].arrival.iataCode,
        departureTime: formatDateTime(flight.itineraries[0].segments[0].departure.at),
        arrivalTime: formatDateTime(flight.itineraries[0].segments[0].arrival.at),
        departureTerminal: flight.itineraries[0].segments[0].departure.terminal ? flight.itineraries[0].segments[0].departure.terminal : 1,
        arrivalTerminal: flight.itineraries[0].segments[0].arrival.terminal ? flight.itineraries[0].segments[0].arrival.terminal : 1, 
        flightClass: flight.travelerPricings[0].fareDetailsBySegment[0].cabin,
        price: convertToINR(flight.travelerPricings[0].price.total),
        seatsAvailable: flight.numberOfBookableSeats,
        checkedBags: flight.travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags ? flight.travelerPricings[0].fareDetailsBySegment[0].includedCheckedBags.weight : 15,
        cabinBaggage: 7,
      }));
      setFlights(formattedFlights);
      localStorage.setItem('flightData', JSON.stringify(formattedFlights)); // Save to local storage
    } else if (savedFlights) {
      setFlights(JSON.parse(savedFlights));
    }
  }, [flightData]);

  const handleViewDetails = (flightId) => {
    setDetailsVisible(prevState => ({
      ...prevState,
      [flightId]: !prevState[flightId]
    }));
    // Example log for specific flight details
    const flightDetails = flights.find(flight => flight.id === flightId);
    // if (flightDetails) {
    //   console.log('Flight Details:', flightDetails);
    // }
  };

  async function sendEmail(flight){
    try {
      const response = await axios.post('http://localhost:3000/sendEmail', {userDetail:userDetail, flight:flight});
      if (response.status === 200) {
        navigate('/');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  }

  const handleBookNow = async(flight) => {
    // console.log("flight: ", flight);
    if (!isLoggedIn) {
      const currentLocation = window.location.pathname;
      localStorage.setItem('flightData', JSON.stringify(flights)); // Save to local storage before redirecting
      navigate('/login', { state: { from: currentLocation } });
    } else {
      localStorage.removeItem('flightData');

      try {
        const response = await axios.post('http://localhost:3000/bookTicket', {userDetail:userDetail, flight:flight});
        if (response.status === 200) {
          alert("Flight has been successfully booked");
          return sendEmail(flight);

        }
      } catch (error) {
        console.error('Error:', error);
      }
    }
  };

  return (
    <div className="search-results">
      <h2>Available Flights</h2>
      {flights.length === 0 ? (
        <p>No flights found</p>
      ) : (
        <ul className="list-group">
          {flights.map((flight, index) => (
            <li key={index} className="ticket">
              <div className="airline">
                <h5>{flightNameMap[flight.airline]}</h5>
              </div>
              <div className="flight-details">
                <div className="route">
                  <div>
                    <p>From</p>
                    <p>{rCityMap[flight.source]}</p>
                    <p>{flight.departureTime}</p>
                    <p>Terminal: {flight.departureTerminal}</p>
                  </div>
                  <div className="aircraft-symbol flight-icon">
                    <img src="/takeoff-the-plane-svgrepo-com.svg" alt="Flight icon" className="flight-icon" />
                  </div>
                  <div>
                    <p>To</p>
                    <p>{rCityMap[flight.destination]}</p>
                    <p>{flight.arrivalTime}</p>
                    <p>Terminal: {flight.arrivalTerminal}</p>
                  </div>
                </div>
                <div className="details">
                  <p>Class: {flight.flightClass}</p>
                </div>
                {detailsVisible[flight.id] && (
                  <div className="additional-details-container">
                    <div className="additional-details">
                      <p>Seats Available: {flight.seatsAvailable}</p>
                      <p>Checked Baggage: {flight.checkedBags} KG</p>
                      <p>Cabin Baggage: {flight.cabinBaggage} KG</p>
                    </div>
                    <button className="book-now-button" onClick={() => handleBookNow(flight)}>Book Now</button>
                  </div>
                )}
              </div>
              <div className="price-details">
                <p>₹ {flight.price}</p>
                <button onClick={() => handleViewDetails(flight.id)}>
                  {detailsVisible[flight.id] ? 'Hide Details' : 'View Details'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Searchflight;
