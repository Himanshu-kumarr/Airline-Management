import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import pg from 'pg';
import bcrypt from 'bcrypt';
import axios from 'axios';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const saltRounds = 10;

app.use(bodyParser.json());
app.use(cors());

const db = new pg.Client({
  user: 'postgres',
  host: 'localhost',
  database: "FlightBooking", //Your DataBase name
  password: process.env.DATABASE_PASSWORD,
  port: 5432,
});

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
    clientId: process.env.OAUTH_CLIENT_ID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN
  }
});

db.connect()
  .then(() => console.log("Connected to PostgreSQL"))
  .catch(err => console.error("Error connecting to PostgreSQL:", err));

  const rCityMap = {
    'BOM': 'Mumbai', 'DEL': 'Delhi', 'BLR': 'Bangalore', 'HYD': 'Hyderabad', 'AMD': 'Ahmedabad',
    'MAA': 'Chennai', 'CCU': 'Kolkata', 'STV': 'Surat', 'PNQ': 'Pune', 'JAI': 'Jaipur',
    'LKO': 'Lucknow', 'KNU': 'Kanpur', 'NAG': 'Nagpur', 'IDR': 'Indore', 'THN': 'Thane',
    'BHO': 'Bhopal', 'VTZ': 'Visakhapatnam', 'PAT': 'Patna', 'BDQ': 'Vadodara', 'GAU': 'Guwahati'
  };

  app.post('/sendEmail', (req, res) => {
    const { userDetail, flight } = req.body;
  
    const departureTime = flight.departureTime;
  
    const [datePart, timePart] = departureTime.split(', ');
  
    try {
      const mailOptions = {
        from: 'teamflyhigh3@gmail.com',
        to: userDetail.email, // Use the user's email
        subject: 'Flight Booking Confirmation',
        text: `🎉 Woohoo! 🎉\nYou've just booked a fabulous flight from ${rCityMap[flight.source]} to ${rCityMap[flight.destination]}! 🌍✨\nYour sky-high adventure is set for ${datePart} at ${timePart}. 🛫\nCheck out all the details and your booking info on our website. Safe travels, high-flyer! 🚀`,
      };
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error('Error sending email:', error);
          res.status(500).send('Error sending email');
        } else {
          console.log('Email sent:', info.response);
          res.status(200).send('Flight booked and email sent');
        }
      });
    } catch (error) {
      console.error('Error booking flight:', error);
      res.status(500).send('Failed to book flight');
    }
  });
  


    app.post('/getFlightsBooked', async (req, res) => {
      const { userDetail } = req.body;
      
      const email = userDetail.email;
      console.log("email : ", email);
  
      try {
          const response = await db.query("SELECT * FROM flightsbooked WHERE useremail = $1", [email]);
          console.log(response.rows[0]); // Use response.rows to get the query results
          res.status(200).json(response.rows);
      } catch (error) {
          console.error('Error fetching booked flights:', error);
          res.status(500).send('Failed to fetch booked flights');
      }
  });
  
  app.post('/submit-signup', async (req, res) => {
    const { firstName, lastName, mobile, email, password } = req.body;
  
    try {
      const checkResult = await db.query("SELECT * FROM users WHERE email = $1", [email]);
      if (checkResult.rows.length > 0) {
        res.status(400).send("Email already exists. Try logging in.");
      } else {
        const hash = await bcrypt.hash(password, saltRounds);
        await db.query("INSERT INTO users(email, password, firstName, lastName, mobileNo) VALUES ($1, $2, $3, $4, $5)", [email, hash, firstName,lastName, mobile]);
        res.status(201).send('Signup successful! You can login now.');
      }
    } catch (error) {
      console.error("Error during signup:", error);
      res.status(500).send('Internal Server Error');
    }
  });

app.post('/submit-form', async (req, res) => {

  const {
    originLocationCode,
    destinationLocationCode,
    departureDate,
    returnDate,
    tripType,
    nonStop,
    flightType,
    travelClass
  } = req.body;

  try {
    console.log('Requesting access token...');
    const tokenResponse = await axios.post(
      'https://test.api.amadeus.com/v1/security/oauth2/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: 'aQrCVg3jDQwKqbwPADAS75DgzwjRlbCk',
        client_secret: 'GajFZb5zrw8htTSn',
      }).toString(),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const accessToken = tokenResponse.data.access_token;
    console.log('Access token obtained:', accessToken);

    console.log('Requesting flight offers...');
    const flightOffersResponse = await axios.get('https://test.api.amadeus.com/v2/shopping/flight-offers', {
      params: {
        originLocationCode,
        destinationLocationCode,
        departureDate,
        returnDate,
        nonStop,
        travelClass,
        adults : 1,
        max:10,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    res.json(flightOffersResponse.data);
  } catch (error) {
    console.error('Error fetching flight offers:', error);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
      console.error('Response headers:', error.response.headers);
      res.status(error.response.status).send(error.response.data);
    } else {
      res.status(500).send('Error fetching flight offers');
    }
  }
});

app.post('/submit-login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length > 0) {
      const user = result.rows[0];

      const storedHashedPassword = user.password;

      bcrypt.compare(password, storedHashedPassword, (err, result) => {
        if (err) {
          console.error("Error comparing passwords:", err);
          res.status(500).send('Internal Server Error');
        } else {
          if (result) {
            res.status(200).send({message:'Login successful!', id:user.id, firstName:user.firstname, lastName:user.lastname, email:user.email, mobileNo:user.mobileno});
          } else {
            res.status(401).send("Incorrect Password");
          }
        }
      });
    } else {
      res.status(404).send("User not found");
    }
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/bookTicket', async (req, res) => {
  const { userDetail, flight } = req.body;
  const { id: userID, email } = userDetail;
  const { id, airline, source, destination, departureTime, arrivalTime, departureTerminal, arrivalTerminal, flightClass, price, seatsAvailable, checkedBags, cabinBaggage } = flight;

  try {
    // Function to format date as YYYY-MM-DD
    const formatDate = (dateString) => {
      const [day, month, year] = dateString.split(', ')[0].split('/');
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    };

    // Function to format time as HH:mm:ss
    const formatTime = (timeString) => {
      const [time, period] = timeString.split(', ')[1].split(' ');
      const [hours, minutes] = time.split(':');
      const hours24 = period === 'PM' ? (parseInt(hours) % 12) + 12 : parseInt(hours) % 12;
      return `${hours24.toString().padStart(2, '0')}:${minutes.padStart(2, '0')}:00`;
    };

    // Format departureDate, departureTime, arrivalDate, and arrivalTime
    const formattedDepartureDate = formatDate(departureTime);
    const formattedDepartureTime = formatTime(departureTime);

    const formattedArrivalDate = formatDate(arrivalTime);
    const formattedArrivalTime = formatTime(arrivalTime);

    // Insert into database
    const bookFlight = await db.query(
      "INSERT INTO FlightsBooked (userID, userEmail, flightID, airline, source, destination, departureDate, departureTime, arrivalDate, arrivalTime, departureTerminal, arrivalTerminal, flightClass, price, seatsAvailable, checkedBags, cabinBaggage) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)",
      [parseInt(userID), email, parseInt(id), airline, source, destination, formattedDepartureDate, formattedDepartureTime, formattedArrivalDate, formattedArrivalTime, departureTerminal, arrivalTerminal, flightClass, price, seatsAvailable, checkedBags, cabinBaggage]
    );

    res.status(200).send('Flight booked successfully');
  } catch (error) {
    console.error("Error during booking", error);
    res.status(500).send('Internal Server Error');
  }
});



app.post('/bookTicket', async (req, res) => {
  const { userDetail, flight } = req.body;
  const { id: userID, email } = userDetail;
  const { id, airline, source, destination, departureTime, arrivalTime, departureTerminal, arrivalTerminal, flightClass, price, seatsAvailable, checkedBags, cabinBaggage } = flight;

  try {
    const bookFlight = await db.query(
      "INSERT INTO FlightsBooked (userID, userEmail, flightID, airline, source, destination, departureTime, arrivalTime, departureTerminal, arrivalTerminal, flightClass, price, seatsAvailable, checkedBags, cabinBaggage) VALUES ($1, $2, $3, $4, $5, TO_TIMESTAMP($6, 'DD/MM/YYYY, HH24:MI'), TO_TIMESTAMP($7, 'DD/MM/YYYY, HH24:MI'), $8, $9, $10, $11, $12, $13, $14, $15)",
      [parseInt(userID), email, parseInt(id), airline, source, destination, departureTime, arrivalTime, departureTerminal, arrivalTerminal, flightClass, price, seatsAvailable, checkedBags, cabinBaggage]
    );

    res.status(200).send('Flight booked successfully');
  } catch (error) {
    console.error("Error during booking", error);
    res.status(500).send('Internal Server Error');
  }
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});