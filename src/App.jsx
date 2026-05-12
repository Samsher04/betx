import { Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";

import Home from "./pages/Home";

import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
     
        <Route path="/profile" element={<Profile />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Layout>
  );
}