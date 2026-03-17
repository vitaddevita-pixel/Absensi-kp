import React, {useState, useEffect} from "react";
import Profile from "../assets/profile.svg";
import arrowCircleIcon from "../assets/icon-arrowcircle.svg";
import ClockIn from "../assets/icon-clockIn.svg";
import { useNavigate, useLocation} from "react-router-dom";
import axios from "axios";

const AttendanceHistory = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [currentTime, setCurrentTime] = useState("--:--");
    const [historyData, setHistoryData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedDetail, setSelectedDetail] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userName, setUserName] = useState("Loading....");

    useEffect(() => {
        const savedHistory = JSON.parse(localStorage.getItem("attendance_history") || "[]");
        if (savedHistory.length > 0) {
            setHistoryData(savedHistory);
        }
    }, []);

    const fetchHistory = async () => {
    setIsLoading(true);
    let apiData = []; 

    try {
        
        const token = localStorage.getItem("token_absensi"); 

        const response = await axios.get("/api/absen/history", {
            headers: {
                'Authorization': `Bearer ${token}` 
            }
        });
        apiData = (response.data?.data || []).map((item, index) => {
            const dt = item.datetime ? new Date(item.datetime) : new Date();
            return {
                id: item.id || index,
                name: item.name || item.nama || item.user?.name || "Unknown",
                date:dt.toLocaleDateString("id-ID"),
                time: dt.toLocaleTimeString("id-ID", {hour: "2-digit", minute: "2-digit"}),
                status: item.status || item.jenis || "Clock In",
                latitude: item.latitude || "-",
                longitude: item.longitude || "-",
                profile_photo: item.face_image || item.face_image_url || null,   
                foto_absen: item.foto || item.file_absensi || null,
                rawDate: dt
            }
            
        });
    } catch (error) {
        console.error("koneksi terputus", error);
        
    } finally {
        
        const localData = JSON.parse(localStorage.getItem("attendance_history") || "[]");
        const combined = [...apiData, ...localData].map(item => {
        
            let sortDate;
            if (item.rawDate) {
                sortDate = new Date(item.rawDate);
            } else if (item.date && item.time) {
                const [day, month, year] = item.date.split('/');
                sortDate = new Date(`${year}-${month}-${day}T${item.time.replace('.', ':')}`);
            } else {
                sortDate = new Date(0); 
            }

            return { ...item, sortDate };
        });

        combined.sort((a, b) => b.sortDate - a.sortDate);

        setHistoryData(combined);
        setIsLoading(false);
    }
};

    useEffect(() => {
        fetchHistory();
    }, []);

    useEffect(() => {
        if (location.state && location.state.newEntry) {
            const entry = location.state.newEntry;
            setCurrentTime(entry.time || entry.waktu || "--:--");

            const newRecord = {
                id: `record-${Date.now()}`,
                name: entry.nama,
                date: entry.tanggal || new Date().toLocaleDateString('id-ID'),
                time: entry.time || new Date().toLocaleTimeString('id-ID', {hour: '2-digit', minute: '2-digit'}),
                latitude: entry.lat || "-",
                longitude: entry.lng || "-",
                profile_photo: entry.face_image || entry.profile_photo || null,
                foto_absen: entry.foto || entry.file_absensi || null,
                status: "Clock In"
            };
            setHistoryData((prevData) => {
                const isAlreadyExist = prevData.some(item => 
                    (item.name === newRecord.name || item.nama === newRecord.name) && 
                    (item.time === newRecord.time || item.waktu === newRecord.time)
                );

                if (isAlreadyExist) return prevData;
                const updateData = [newRecord, ...prevData];
                localStorage.setItem("attendance_history", JSON.stringify(updateData));
                localStorage.setItem("last_clock_in", entry.time || entry.waktu);
                return updateData;
            });

            window.history.replaceState({}, document.title);
        }
    }, [location.state]);
    useEffect(() => {
        const savedTime = localStorage.getItem("last_clock_in");

        if (savedTime && savedTime !== "--:--") {
            setCurrentTime(savedTime);
            return;
        }

        if (historyData.length > 0) {
            const latestTime = historyData[0].time || "--:--";

            setCurrentTime(latestTime);
            localStorage.setItem("last_clock_in", latestTime);
        }
    }, [historyData]);
    useEffect(() => {
        const userData = JSON.parse(localStorage.getItem("user_data") || "{}");

        if (userData.nama) {
             setUserName(userData.nama);
        } else if (userData.user_id) {
            setUserName(userData.user_id);
        } else if (historyData.length > 0) {
            setUserName(historyData[0].name);
        }
    }, [historyData])

    const openModal = (item) => {
        console.log(item);
        setSelectedDetail(item);
        setIsModalOpen(true);
    }

    const getProfilePhoto = (photo) => {
        if (!photo) return Profile;

        if (photo.startsWith("data:image")) return photo;

        if (photo.startsWith("http")) return photo;

        if (photo.startsWith("/uploads")) {
            return `https://api-reqruitment.tkilocal.biz.id${photo}`;
        }

        return Profile;
    };

    const getBuktiPhoto = (photo) => {
        if (!photo) return null;

        if (photo.startsWith("data:image")) return photo;

        if (photo.startsWith("http")) return photo;

        if (photo.startsWith("/uploads")) {
            return `https://api-reqruitment.tkilocal.biz.id${photo}`;
        }

        return null;
    };

  return (
    <div className="flex min-h-screen w-full bg-[#f8f9fa]">
        {/*kiri*/}
        <aside className="w-[397px] bg-white border-[hsla(0,0%,78%,1)] flex flex-col shrink-0">
            <div className="w-full h-[80px] pl-[24px] pr-[24px] flex justify-between items-center border-b border-[hsla(0,0%,78%,1)]">
                <h1 className="font-sans font-[700] text-[20px] leading-none text-black">
                    {userName}
                </h1>
              
                <div className="w-[44px] h-[44px] mr-[24px] rounded-full overflow-hidden border border-gray-100 shrink-0">
                    <img 
                    src={Profile}
                    className="w-full h-full object-cover"
                    alt="profile"
                    />
                 </div>       
            </div>

            <div className="p-[12px]">
                <button 
                onClick={() => navigate("/attendance-capture")}
                className="relative w-[373px] h-[56px] flex items-center bg-white border border-[hsla(31,91%,50%,1)] rounded-[32px] overflow-hidden group">
                    <div className="ml-[7px] w-[44px] h-[44px] bg-[hsla(31,91%,50%,1)] rounded-[32px] flex items-center justify-center shrink-0">
                        <img
                        src={ClockIn}
                        alt="icon-clockIn"
                        className="w-[36px] h-[40px] object-cover"
                        />
                    </div>

                    <div className="ml-[12px] flex flex-col items-start justify-center">
                        <span className="font-serif font-[700] text-[15px] leading-[100%] text-black">
                            Absensi Masuk
                        </span>
                        <span className="text-[12px] text-gray-[400] mt-[4px] leading-none">
                            {currentTime} WIB
                        </span>
                    </div>

                    <div className="absolute right-[15px] -rotate-[90]">
                        <img
                        src={arrowCircleIcon}
                        alt="icon-arrowcircle"
                        className="w-[25px] h-[25px]"
                        />
                    </div>
                </button>
            </div>
        </aside>

        {/*kanan*/}
        <main className=" flex-1 flex flex-col bg-[#fafafa] overflow-y-auto pr-[16px]">
            
            <div className="h-[80px] pr-[32px] pl-[24px] flex items-start border-[hsla(0,0%,78%,1)] bg-white">
                <h2 className="font-[700] text-[18px] text-black">
                Riwayat Hari ini
                </h2>
            </div>
            
            
            <div className="flex flex-col gap-[15px] w-full p-[24px] -mt-[12px] items-start">
                
                {historyData.map((item, index) => (
                    <div
                        key={index}
                        className="w-full max-w-[900px] h-[84px] bg-white border border-[hsla(0,0%,90%,1)] rounded-[16px] flex items-center pl-[24px] pr-[16px]"
                    >
                        <div className="flex-1 flex flex-col justify-center min-w-0">
                            <span className="font-serif font-[700] text-[12px] text-[hsla(0,0%,40%,1)]">
                                {item.name}
                            </span>
                            <span className="font-serif font-[700] text-[12px] leading-tight text-[hsla(0,0%,40%,1)] mt-[2px]">
                                {item.date}
                            </span>
                            <span className="text-[9px] text-[hsla(0,0%,78%,1)] uppercase mt-[4px]">
                                Waktu
                            </span>
                        </div>
                     
                        <div className="flex-1 flex left-[65%] -translate-x-1/2 flex-col items-center justify-center shrink-0">
                            <span className="font-sans font-[400] text-[12px] text-[hsla(0,0%,40%,1)] justify-center">
                                {item.time}
                            </span>
                            <span className="font-sans font-[500] text-[9px] text-[hsla(0,0%,78%,1)] uppercase mt-[4px]">
                                {item.status}
                            </span>
                        </div>

                        <div className="w-[40px] shrink-0 flex items-center justify-end">
                             <button
                                    onClick={() => openModal(item)}
                                    className="w-[36px] h-[36px] flex items-center justify-center bg-transparent border-none outline-none hover:opacity-70 transition-opacity"
                                > 
                                    <img
                                    src={arrowCircleIcon}
                                    alt="icon-arrowcircle"
                                    className="w-[25px] h-[25px]"
                                    />
                                </button> 
                        </div>
                    </div>
                ))}
            </div>         
        </main>

        {isModalOpen && selectedDetail && (    
                <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-[hsla(0,0%,0%,0.2)] w-full h- full">          
                    <div className="bg-white flex flex-col shadow-xl" 
                         style={{ width: '400px', MaxHeight: '90vh', borderRadius: '25px', padding: '24px', gap: '10px', backgroundColor: '#FFFFFF', boxShadow: '0px 20px 25px -5px rgba(0,0,0,0.1), 0px 10px 10px -5px(0,0,0,0.04)', overflowY: 'auto' }}>
                        <div className="flex justify-end items-center" style={{ width: '359px', height: '30px', padding: '3px', gap: '10px'}}>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 font-bold text-[20px] hover:text-black">✕</button>
                        </div>

                      
                        <div className="flex flex-col justify-between items-center overflow-y-auto" style={{ width: '359px', height: '712px' }}>
                            
                            
                            <div className="flex flex-col justify-center " style={{ width: '359px', height: '306px', gap: '7px' }}>                            
                                <div className="flex justify-center" style={{ width: '359px', height: '137px', gap: '10px' }}>
                                    <img 
                                        src={getProfilePhoto(selectedDetail?.profile_photo)}
                                        alt="Profile" 
                                        style={{ width: '133px', height: '137px', borderRadius: '100px', objectFit: 'cover' }} 
                                    />
                                </div>

                                <div className="flex flex-col" style={{ gap: '7px' }}>
                                    <DetailRow label="Nama Karyawan" value={selectedDetail?.name || selectedDetail?.nama} />
                                    <DetailRow label="Create Time" value={`${selectedDetail?.date}; ${selectedDetail?.time}`} />
                                    <DetailRow label="Longitude" value={selectedDetail?.longitude} />
                                    <DetailRow label="Latitude" value={selectedDetail?.latitude} />
                                </div>
                            </div>

                            <div className="w-full flex flex-col mt-auto">
                                <span className="text-[12px] font-medium text-gray-400 block mb-[7px] font-['Satoshi']">Bukti Foto</span>
                                <div className="relative border-2 border-gray-100 rounded-[12px] overflow-hidden bg-gray-50 flex items-center justify-center" 
                                    style={{ width: '359px', height: '350px', marginTop: '5px'}}>
                                    {selectedDetail?.foto_absen ? (
                                        <img
                                        src={getBuktiPhoto(selectedDetail?.foto_absen)}
                                        style={{ width: "100%", height: "100%", objectFit: "contain" }}
                                        alt="bukti"
                                    />
                                    ) : (
                                    <span className="text-[12px] italic text-gray-400">
                                        Tidak ada gambar
                                    </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
    </div>
  )
};

const DetailRow = ({ label, value }) => (
    <div className="flex flex-col border-b border-gray-100 py-2 w-full">
        <span className="text-[10px] uppercase tracking-wider text-gray-400 font-bold font-['Satoshi']">
            {label}
        </span>
        <span className="text-[14px] font-semibold text-gray-800 mt-1">
            {value || "-"}
        </span>
    </div>
);
export default AttendanceHistory;

