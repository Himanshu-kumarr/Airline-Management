DROP TABLE IF EXISTS users;
CREATE TABLE users(
	id SERIAL PRIMARY KEY,
	email VARCHAR(100) UNIQUE,
	password VARCHAR(500),
	firstName VARCHAR(50),
	lastName VARCHAR(50),
	mobileNo VARCHAR(50)
);

select * from users;

DROP TABLE IF EXISTS FlightsBooked;

CREATE TABLE FlightsBooked (
	bookingID SERIAL PRIMARY KEY,
    userID INT,
    userEmail VARCHAR(255),
	flightID INT,
    airline VARCHAR(10),
    source VARCHAR(10),
    destination VARCHAR(10),
    departureDate DATE,
    departureTime TIME,
    arrivalDate DATE,
    arrivalTime TIME,
    departureTerminal VARCHAR(10),
    arrivalTerminal VARCHAR(10),
    flightClass VARCHAR(20),
    price DECIMAL(10, 2),
    seatsAvailable INT,
    checkedBags INT,
    cabinBaggage INT
);



SELECT * FROM FlightsBooked;

