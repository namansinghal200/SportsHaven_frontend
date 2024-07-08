import logo from "./logo.svg";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import Register from "./pages/Register";
import Login from "./pages/Login.js";
import Home from "./pages/Home.js";
import DetailedLobbyCard from "./pages/Lobby.js";

function App() {
  const { user } = useSelector((state) => state.user);
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/home" element={<Home />} />
        <Route path="/lobbies/:lobbyid" element={<DetailedLobbyCard />} />
      </Routes>
    </Router>
  );
}

export default App;
