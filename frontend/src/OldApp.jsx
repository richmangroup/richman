import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Home from "./pages/Home";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";
import Profile from "./pages/Profile";
import About from "./pages/About";
import CrashGame from "./pages/CrashGame";
import Navbar from "./components/Navbar";

function App() {
  const location = useLocation();

  // Hide Navbar on login and register
  const hideNavbar = location.pathname === "/login" || location.pathname === "/register";

  return (
    <>
      {/* {!hideNavbar && <Navbar />} */}

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/home" element={<Home />} />
        <Route path="/deposit" element={<Deposit />} />
        <Route path="/withdraw" element={<Withdraw />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/crash-game" element={<CrashGame />} />

      </Routes>
    </>
  );
}

export default App;
