import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Tasks from "../pages/Tasks";
import Profile from "../pages/Profile";
import Admin from "../pages/Admin";
import NotFound from "../pages/NotFound";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/tasks" element={<Tasks />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}