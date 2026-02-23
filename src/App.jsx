import React from "react";
import {Routes, Route, Navigate} from "react-router-dom";
import Login from "./components/login.jsx";
import AttendanceHistory from "./components/AttendanceHistory.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login/>}/>

      <Route path="/history" element={<AttendanceHistory/>}/>

      <Route path="*" element={<Navigate to="/"/>}/>
    </Routes>
  )
}
export default App;

