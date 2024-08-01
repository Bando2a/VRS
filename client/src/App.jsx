import { Route, Routes } from "react-router-dom";
import Navbar from "./components/shared/Navbar";
import Home from "./components/pages/Home";
import Booking from "./components/pages/Booking";
import Registration from "./components/pages/Registration";
import Login from "./components/pages/Login";
import Profile from "./components/pages/Profile";
import Footer from "./components/shared/Footer";
import Stats from "./components/pages/Stats";
// import Hero from "./components/pages/Hero";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/home" element={<Home />} />
        <Route path="/" element={<Home />} />
        <Route path="/book/:venueid" element={<Booking />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile/:userId" element={<Profile />} />
        <Route path="/stats" element={<Stats />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
