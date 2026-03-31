import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const AttendanceReview = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [selectedFile, setSelectedFile] = useState(null);
    const [isUpLoading, setIsUpLoading] = useState(false);
    const [errorValidasi, setErrorValidasi] = useState("");
   

    const { foto, lokasi } = location.state || {};

    const saveData = JSON.parse(localStorage.getItem("user_data") || "{}");
    const namaUser = saveData.user?.name || "Karyawan";

    const userData = {
        nama: namaUser,
        tanggal: new Date().toLocaleDateString('id-ID', {day: '2-digit', month: '2-digit', year: 'numeric'}),
        waktu: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit'}),
        lat: lokasi ?.[0] || "-7.4395730574307543",
        lng: lokasi ?.[1] || "110.9382480304",
        foto: foto
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                setErrorValidasi("Ukuran file terlalu besar! maksimal 2mb")
                setSelectedFile(null);
            } else {
                setErrorValidasi("");
                setSelectedFile(file);
            }
        }
    }

    const handleBrowseClick = () => {
        fileInputRef.current.click();
    };

    const handleKirimAbsensi = async () => {
        if (!selectedFile) {
            postMessage("Silakan pilih bukti foto terlebih dahulu");
            return;
        }

        const MY_TOKEN = localStorage.getItem("token_absensi");
        if(!MY_TOKEN) {
            alert("sesi login berakhir, silahkan login kembali");
            navigate("/login");
            return;
        }
        setIsUpLoading(true);

        try {
           const reader = new FileReader();
           reader.readAsDataURL(selectedFile);

           reader.onloadend = () => {
            const base64Bukti = reader.result;
            const oldHistory = JSON.parse(localStorage.getItem("attendance_history") || "[]");
            const newRecord = {
                id: Date.now(),
                name: userData.nama,
                date: userData.tanggal,
                time: userData.waktu,
                latitude: userData.lat,
                longitude: userData.lng,
                profile_photo: foto,       
                foto_absen: base64Bukti,   
                status: "Clock In"
            };
            const updatedHistory = [newRecord, ...oldHistory];
            localStorage.setItem("attendance_history", JSON.stringify(updatedHistory));
            navigate("/attendance-success", {
                state: { dataAbsen: newRecord }
            });
           }
        } catch (err) {
            console.error("Upload error:", err);
            alert("Terjadi kesalahan koneksi ke server.");
        } finally {
            setIsUpLoading(false);
        }
    }

   return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 font-['Satoshi']">
            <div 
                style={{ 
                    width: '1409px', 
                    height: '723px', 
                    borderRadius: '23px', 
                    border: '1px solid #c8c8c8',
                    boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)', 
                }}
                className='bg-white p-[24px] flex flex-col justify-between transition-all'
            >
                <div className="flex flex-col gap-[20px]">
                    <div className="flex flex-row items-center gap-[10px] w-[1361px] h-[137px]">
                        <div className="w-[133px] h-[137px] rounded-full overflow-hidden shrink-0">
                            <img 
                                src={foto || "https://via.placeholder.com/133"} 
                                alt="Profile" 
                                className="w-full h-full object-cover" 
                            />
                        </div>
                    </div>
                    {[
                        { label: "Nama Karyawan", value: userData.nama },
                        { label: "Waktu Absen", value: userData.waktu },
                        { label: "Latitude", value: userData.lat },
                        { label: "Longitude", value: userData.lng }
                    ].map((item, index) => (
                        <div key={index} className="flex flex-col gap-[7px] w-[1361px] h-[46px] border-b border-[#c8c8c8]">
                            <label className="w-[88px] h-[16px] text-[12px] font-[500] leading-[100%] text-[#000000]">
                                {item.label}
                            </label>
                            <p className="min-w-[53px] h-[16px] text-[12px] font-[500] leading-[100%] text-[#000000]">
                                {item.value}
                            </p>
                        </div>
                    ))}
                    <div className="flex flex-col gap-[7px] w-[1361px] h-[105px] rounded-[13px] p-[12px] bg-white">
                        <label className="w-[88px] h-[16px] text-[12px] font-[500] leading-[100%] text-[#000000]">
                            Bukti Foto
                        </label>
                        <div className="flex flex-row items-center gap-[10px]">
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/jpeg, image/jpg*"
                                onChange={handleFileChange}
                            />
                            <button 
                                onClick={handleBrowseClick}
                                style={{ backgroundColor: '#c8c8c8' }}
                                className="w-[52px] h-[28px] rounded-[4px] p-[6px] flex items-center justify-center border-none outline-none cursor-pointer"
                            >
                                <span className="text-[12px] font-[500] text-white">Browse</span>
                            </button>
                            <span className="w-[50px] h-[16px] text-[12px] font-[500] text-[#c8c8c8] leading-[100%]">
                                {selectedFile ? selectedFile.name : "Upload..."}
                            </span>
                        </div>
                        {errorValidasi ? (
                            <p className='text-[10px] font-[500] text-red-500 italic bold leading-[100%]'>

                            </p>
                        ) : (
                             <p className="w-[108px] h-[16px] text-[12px] font-[400] italic text-[#5947fc] leading-[100%]">
                            Format jpg max 2mb
                        </p>
                        )}
                    </div>
                </div>

                <div className="flex justify-end w-[1361px] h-[45px] gap-[10px]">
                    <button 
                        onClick={handleKirimAbsensi}
                        disabled={isUpLoading}
                        style={{ backgroundColor: '#f4840b' }}
                        className="w-[130px] h-[45px] rounded-[32px] px-[24px] py-[7px] flex flex-row items-center justify-center gap-[10px] border-none outline-none cursor-pointer shadow-lg active:scale-95 transition-all"
                    >
                        <span className="text-white font-[500] text-[12px]">
                            {isUpLoading ? "..." : "Kirim Absensi"}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AttendanceReview;