import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Form, Button, Row, Col } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';  // Import useNavigate
import './Form.css';

const cityMap = {
  'Mumbai': 'BOM', 'Delhi': 'DEL', 'Bangalore': 'BLR', 'Hyderabad': 'HYD', 'Ahmedabad': 'AMD',
  'Chennai': 'MAA', 'Kolkata': 'CCU', 'Surat': 'STV', 'Pune': 'PNQ', 'Jaipur': 'JAI',
  'Lucknow': 'LKO', 'Kanpur': 'KNU', 'Nagpur': 'NAG', 'Indore': 'IDR', 'Thane': 'THN',
  'Bhopal': 'BHO', 'Visakhapatnam': 'VTZ', 'Pimpri-Chinchwad': 'PNQ', 'Patna': 'PAT', 'Vadodara': 'BDQ',
  'Guwahati': 'GAU'
};

function formatDateToYYYYMMDD(date) {
  const formattedDate = date.toISOString().split('T')[0];
  return formattedDate;
}

const CustomForm = () => {
  const navigate = useNavigate();  // Initialize navigate
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [departureDate, setDepartureDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [tripType, setTripType] = useState('one-way');
  const [nonStop, setNonStop] = useState(true);
  const [flightType, setFlightType] = useState('direct');
  const [travelClass, setTravelClass] = useState('BUSINESS');
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const errors = {};
    if (!source) errors.source = 'Source is required';
    if (!destination) errors.destination = 'Destination is required';
    if (!departureDate) {
      errors.departureDate = 'Departure date is required';
    } else {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Ignore the time part
      if (new Date(departureDate) < today) {
        errors.departureDate = 'Departure date cannot be in the past';
      }
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    const formData = {
      originLocationCode: cityMap[source],
      destinationLocationCode: cityMap[destination],
      departureDate,
      returnDate,
      tripType,
      nonStop,
      flightType,
      travelClass
    };

    try {
      const response = await axios.post('http://localhost:3000/submit-form', formData);
      navigate("/searchflight", { state: response.data });  // Pass formData as state
    } catch (error) {
      console.error('Error:', error);
    }
  };


  

  return (
    <div className="form-container">
      <Form onSubmit={handleSubmit} className="p-4 border rounded bg-light">
        <div className="class-selection">
          <button
            type="button"
            className={travelClass === 'ECONOMY' ? 'active' : ''}
            onClick={() => setTravelClass('ECONOMY')}
          >
            ECONOMY CLASS
          </button>
          <button
            type="button"
            className={travelClass === 'BUSINESS' ? 'active' : ''}
            onClick={() => setTravelClass('BUSINESS')}
          >
            BUSINESS CLASS
          </button>
          <button
            type="button"
            className={travelClass === 'FIRST' ? 'active' : ''}
            onClick={() => setTravelClass('FIRST')}
          >
            FIRST CLASS
          </button>
        </div>
        <Row className="mb-3">
          <Form.Group as={Col} controlId="formSource">
            <Form.Label>Source</Form.Label>
            <Form.Control
              as="select"
              value={source}
              onChange={(e) => setSource(e.target.value)}
              isInvalid={!!errors.source}
            >
              <option value="">Select Source</option>
              {Object.keys(cityMap).map((city, index) => (
                <option key={index} value={city}>{city}</option>
              ))}
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              {errors.source}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col} controlId="formDestination">
            <Form.Label>Destination</Form.Label>
            <Form.Control
              as="select"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              isInvalid={!!errors.destination}
            >
              <option value="">Select Destination</option>
              {Object.keys(cityMap).map((city, index) => (
                <option key={index} value={city}>{city}</option>
              ))}
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              {errors.destination}
            </Form.Control.Feedback>
          </Form.Group>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} controlId="formDepartureDate">
            <Form.Label>Departure Date</Form.Label>
            <DatePicker
              selected={departureDate ? new Date(departureDate) : null}
              onChange={(date) => setDepartureDate(formatDateToYYYYMMDD(date))}
              className="form-control"
              placeholderText="Select Departure Date"
              minDate={new Date()}
              isInvalid={!!errors.departureDate}
            />
            <Form.Control.Feedback type="invalid" className="d-block">
              {errors.departureDate}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group as={Col} controlId="formReturnDate">
            <Form.Label>Return Date</Form.Label>
            <DatePicker
              selected={returnDate ? new Date(returnDate) : null}
              onChange={(date) => setReturnDate(formatDateToYYYYMMDD(date))}
              className="form-control"
              placeholderText="Select Return Date"
              minDate={departureDate ? new Date(departureDate) : new Date()}
              disabled={tripType !== 'round-trip'}
            />
          </Form.Group>
        </Row>

        <fieldset className="mb-3">
          <Form.Group as={Row}>
            <Form.Label as="legend" column sm={2}>
              Trip Type
            </Form.Label>
            <Col sm={10}>
              <Form.Check
                type="radio"
                label="One Way"
                name="tripType"
                id="one-way"
                value="one-way"
                checked={tripType === 'one-way'}
                onChange={(e) => setTripType(e.target.value)}
              />
              <Form.Check
                type="radio"
                label="Round Trip"
                name="tripType"
                id="round-trip"
                value="round-trip"
                checked={tripType === 'round-trip'}
                onChange={(e) => setTripType(e.target.value)}
              />
            </Col>
          </Form.Group>
        </fieldset>

        <fieldset className="mb-3">
          <Form.Group as={Row}>
            <Form.Label as="legend" column sm={2}>
              Flight Type
            </Form.Label>
            <Col sm={10}>
              <Form.Check
                type="radio"
                label="Direct"
                name="flightType"
                id="direct"
                value="direct"
                checked={flightType === 'direct'}
                onChange={(e) => {
                  setNonStop(true);
                  return setFlightType(e.target.value);
                }}
              />
              <Form.Check
                type="radio"
                label="Connecting"
                name="flightType"
                id="connecting"
                value="connecting"
                checked={flightType === 'connecting'}
                onChange={(e) => {
                  setFlightType(e.target.value);
                  return setNonStop(false);
                }}
              />
            </Col>
          </Form.Group>
        </fieldset>

        <Button variant="primary" type="submit">
          Search
        </Button>

      </Form>
    </div>
  );
};

export default CustomForm;
