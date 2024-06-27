import { useState } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Signup from '../src/Pages/Signup';
import Login from '../src/Pages/Login';
import Header from '../components/homepage/Header';
import Homepage from '../src/Pages/Homepage';
import Searchflight from '../src/Pages/Searchflight';
import ProfilePage from '../src/Pages/ProfilePage'


function App() { 
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  function handleisLoggedIn(value){
    console.log("handleisLoggedIn called and value = ", value);
    return setIsLoggedIn(value);
  }

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const [userDetail, setUserDetail]= useState(null);

  return (
    <div className="App">
      <Router>
        <Header isLoggedIn={isLoggedIn} setIsLoggedIn={handleisLoggedIn} onLogout={handleLogout} />www
        <Routes>
          <Route path="/" element={<Homepage isLoggedIn={isLoggedIn} />} />
          <Route path="/login" element={<Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setUserDetail={setUserDetail}/>} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/searchflight" element={<Searchflight isLoggedIn={isLoggedIn} userDetail={userDetail} />} />
          <Route path="/profile" element={<ProfilePage isLoggedIn={isLoggedIn} userDetail={userDetail} />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
