import React from "react";
import {Routes, Route, Navigate} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./components/Login.jsx";
import AttendanceHistory from "./components/AttendanceHistory.jsx";
import AttendanceCapture from "./components/AttendanceCapture.jsx";
import AttendanceReview from "./components/AttendanceReview.jsx";
import AttendanceConfirm from "./components/AttendanceConfirm.jsx";

function App() {
  return (
    <>
      <Toaster position="top-right"/>
       <Routes>
          <Route path="/" element={<Login/>}/>

          <Route path="/history" element={<AttendanceHistory/>}/>

          <Route path="/attendance-capture" element={<AttendanceCapture/>}/>

          <Route path="/review-absensi" element={<AttendanceReview/>}/>

          <Route path="/attendance-success" element={<AttendanceConfirm/>} />
        </Routes>
    </>
   
  )
}
export default App;

