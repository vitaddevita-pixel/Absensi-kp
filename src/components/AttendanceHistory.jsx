import React, {useState, useEffect} from "react";
import Profile from "../assets/profile.svg";
import arrowCircleIcon from "../assets/icon-arrowcircle.svg";
import ClockIn from "../assets/icon-clockIn.svg";


const AttendanceHistory = () => {
   const [selectedHistory, setSelectedHistory] = useState(null);
   

    useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  const historyData = Array(10).fill({
    name: "John Doe",
    date: "05/12/2024",
    time: "08:42",
    status: "Clock In"
  });

  return (
    <div className="flex min-h-screen w-full bg-[#f8f9fa]">
        {/*kiri*/}
        <aside className="w-[397px] bg-white border-[hsla(0,0%,78%,1)] flex flex-col shrink-0">
            <div className="w-full h-[80px] pl-[24px] pr-[24px] flex justify-between items-center border-b border-[hsla(0,0%,78%,1)]">
                <h1 className="font-sans font-[700] text-[20px] leading-none text-black">
                    John Doe
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
                <button className="relative w-[373px] h-[56px] flex items-center bg-white border border-[hsla(31,91%,50%,1)] rounded-[32px] overflow-hidden group">
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

                        <div className="w-[40] shrink-0 flex items-center justify-end">
                             <div className="w-[36px] h-[36px] shrink-0 flex items-center justify-center rounded-full -rotate-[90]">
                                 <img
                                 src={arrowCircleIcon}
                                 alt="icon-arrowcircle"
                                className="w-[25px] h-[25px]"
                            />
                             </div>
                        </div>
                    </div>
                ))}
            </div>         
        </main>
    </div>
  )
};
export default AttendanceHistory;


