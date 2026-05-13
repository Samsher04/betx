import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import Home from "./pages/Home";

import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import GameLobby from "./pages/GameLobby";
import Deposit from "./pages/Deposit";
import Withdraw from "./pages/Withdraw";
import Statement from "./pages/Statement";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/game-lobby" element={<GameLobby />} />
        <Route path="/deposit" element={<Deposit />} />
        <Route path="/withdraw" element={<Withdraw />} />
         <Route path="/transactions" element={< Statement/>} />
      </Routes>
    </Layout>
  );
}
