import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import checkIcon from '../assets/icon-success.svg';

const AttendanceConfirm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const data = location.state?.dataAbsen;

    const getFormattedDate = (dateStr) => {
        try {
            if (!dateStr) return "Today, -";
            const parts = dateStr.split('/');
            let dateObj;
            if (parts.length === 3) {
                dateObj = new Date(parts[2], parts[1] - 1, parts[0]);
            } else {
                dateObj = new Date();
            }
            const options = { day: 'numeric', month: 'long', year: 'numeric' };
            const formatted = new Intl.DateTimeFormat('id-ID', options).format(dateObj);
            return `Today, ${formatted}`;
        } catch (e) {
            return `Today, ${dateStr}`;
        }
    };

    if (!data) {
        return (
            <div className="flex items-center justify-center h-screen">
                <button onClick={() => navigate("/history")}>Home</button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#d9d9d9] flex items-center justify-center font-sans">
            <div
                style={{
                    width: "514px",
                    height: "519px",
                    borderRadius: "43px",
                    backgroundColor: "white",
                    padding: "40px" 
                }}
                className="flex flex-col items-center justify-center shadow-[0_6px_10px_rgba(0,0,0,0.15)]"
            >
            
                <div className="w-[180px] h-[180px] flex items-center justify-center mb-2">
                    <img src={checkIcon} alt="success" className="w-full h-full object-contain" />
                </div>

                <div className="flex flex-col items-center leading-tight">
                    <p className="text-[16px] font-medium text-black m-0">{data.nama}</p>
                    <p className="text-[16px] font-bold text-black m-0">Kantor Pusat</p>
                </div>

                <h1 className="text-[64px] font-bold text-black mt-2 mb-0 leading-none">
                    {data.time || data.waktu}
                </h1>

                <p className="text-[14px] font-bold text-black mt-5 mb-10 tracking-wide">
                    {getFormattedDate(data.date || data.tanggal)}
                </p>

                <button
                    onClick={() => navigate("/history", { state: { newEntry: data } })}
                    style={{
                        width: "314px",
                        height: "44px",
                        borderRadius: "32px",
                        backgroundColor: "#F4840B"
                    }}
                    className="text-white font-bold text-[14px] flex items-center justify-center hover:brightness-110 transition-all outline-none"
                >
                    Home
                </button>
            </div>
        </div>
    );
};

export default AttendanceConfirm;