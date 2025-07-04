import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Header from "./Components/Header/Header";
import Register from "./Components/Register/Register";
import Login from "./Components/Login/Login";
import CommentsPage from "./Components/Comments/Comments";
import ForgotPassword from "./Components/ForgotPassword/ForgotPassword";
import ResetPassword from "./Components/ResetPassword/ResetPassword";
import AdminDashboard from "./Components/AdminDashboard/AdminDashboard";

export const ENDPOINT = "https://levich-assignment-1.onrender.com/api/";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route index path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/comments" element={<CommentsPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="*" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
