import React, { useState, useEffect, useRef} from "react";
import { useNavigate } from "react-router-dom";
import Webcam from "react-webcam";
import { MapContainer, TileLayer, Marker, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";


import camera from "../assets/icon-camera.svg";
import X from "../assets/icon-x.svg";

import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { Bold } from "lucide-react";
let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12,41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const dataURLtoFile = (dataurl, filename) => {
    let arr = dataurl.split(','),
    mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), 
        n = bstr.length, 
        u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type: mime});
};


const ChangeView = ({ center }) => {
    const map = useMap();
    map.setView(center);
    return null;
};

const AttendanceCapture = () => {
    const [image, setImage] = useState(null);
    const navigate = useNavigate();
    const webcamRef = useRef(null);
    const [deviceId, setDevicedId] = useState({});
    const [isConfirmed, setIsConfirmed] = useState(false);
    const [userLocation, setUserLocation] = useState([-7.3305, 110.5084]);


    const capture = React.useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setImage(imageSrc);
        setIsConfirmed(false);
    }, [webcamRef]);

    const handleDevices = React.useCallback(
        (MediaDevices) =>
            setDevicedId(MediaDevices.filter(({ kind }) => kind === "videoinput")[0]?.deviceId),
        [setDevicedId]
    );

    useEffect(() => {
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition((pos) => {
                console.log("Lokasi ditemukan:", pos.coords.latitude, pos.coords.longitude);
                setUserLocation([pos.coords.latitude, pos.coords.longitude]);
            }, (err) => {
                console.error("Gagal akses lokasi. pastikan GPS aktif");
            });
        }
        
    }, [handleDevices]);

    const handleFaceUpload = async () => {
    if (!image) {
        alert("Ambil foto terlebih dahulu");
        return;
    }

    console.log("Mencoba upload ke:", `api/face/upload`);

    try {
        const file = dataURLtoFile(image, "face.jpg");
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(`api/face/upload`, {
            method: "POST",
            body: formData,
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Face upload sukses:", data);
            checkLocation(userLocation[0], userLocation[1], image);
        } else {
            alert("Wajah tidak dikenali oleh sistem");
        }

    } catch (err) {
        alert(err);
    };

    navigate("/review-absensi", {
        state: {
            foto: image,
            lat: userLocation[0],
            lng: userLocation[1],
        },
    });
};

    const checkLocation = async (lat, lng, image) => {
        try {
            const response = await fetch(
                `api/location/check?lat=${lat}&lng=${lng}`
            );

            const data = await response.json();
            console.log("Location check:", data);

            if (data.success) {
                navigate("/review-absensi", {
                    state: {
                        foto: image,
                        lat: lat,
                        lng: lng
                    }
                });
            } else {
                alert("Anda berada di luar area kantor");
            }

    } catch (error) {
        console.error("Location check error:", error);
    }
};


    return (
        <div className="flex w-full h-screen bg-[#F8F9FA] overflow-hidden font-sans">
            <div className="w-[450px] h-full bg-white rounded-[43px] p-[24px] flex flex-col gap-[10px] m-auto shadow-sm relative shrink-0">
                <div className="w-full flex justify-end">
                    <button onClick={() => navigate(-1)} className="hover:opacity-70 transition-opacity">
                        <img src={X} alt="icon-x" className="w-[24px] h-[24px]"/>
                    </button>
                </div>

                <div className="w-full max-w-[400px] aspect-[3/4] bg-black rounded-[25px] relative overflow-hidden self-center flex justify-center">
                    {image ? (
                        <img
                            src={image}
                            alt="hasil-foto"
                            className="w-full h-full object-cover transform"
                        />

                    ) : ( 
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            mirrored={true}
                            videoConstraints={{ width: 640, height: 480, facingMode: "user"}}
                            className="w-full h-full object-cover"
                        />                 
                    )}
                    <div className="absolute w-[70%] h-[50%] top-[20%] border-[4px] border-[hsla(143,93%,42%,1)] z-10 pointer-events-none rounded-lg "></div>
                </div>

                <div className="w-full flex justify-center gap-4">
                    {!image ? (
                        <button
                            onClick={capture}
                        >
                            <div className="w-full h-full rounded-full flex items-center justify-center outline-none border-none">
                                <img src={camera} alt="icon-camera" className="w-full h-full object-cover transform scale-x-[1]"/>
                            </div>
                        </button>
                    ) : (
                        <div className="flex w-full gap-4 mt-4 animate-in fade-in zoom-in duration-300 px-4">
                           <button 
                            onClick={() => {
                                setImage(null);
                                setIsConfirmed(false);

                            }}
                            style = {{ color: "white", text: Bold, fontSize: '16px'}}
                            className="flex-1 h-[48px] w-[120px] py-3 bg-[#CD0808] !text-white border-none outline-none rounded-full font-bold text-base hover:bg-red-700 transition-colors items-center justify-center"> Ulangi</button>
                            <button 
                            onClick={() => setIsConfirmed(true)}
                            style={{ color : "white", text: Bold, fontSize:"16px"}}
                            className={`flex-1 h-[48px] w-[120px] py-3 border-none outline-none rounded-full font-bold text-base items-center justify-center transition-colors
                            ${isConfirmed 
                            ? "bg-[hsla(0,0%,40%,1 )] cursor-not-allowed" 
                            : "bg-[#F4840B] hover:bg-orange-600"}
`                           }
                            >
                                Konfirmasi
                            </button>
                        </div>
                    )}
                    
                </div>
                
            </div>

            <div className="w-[1343px] h-screen relative bg-[#E5E7EB] flex-1">
               
                <MapContainer center={userLocation} zoom={15} style={{ height: '100%', width: '100%', zIndex: 0 }}>
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; OpenStreetMap contributors'
                    />
                    <Marker position={userLocation} />
                    <ChangeView center={userLocation}/>
                </MapContainer>

                <div className="absolute bottom-[40px] left-1/2 -translate-x-1/2 w-[90%] max-w-[800px] bg-[#FFFFFF] opacity-100 rounded-[20px] p-[24px] flex items-center justify-between border border-gray-100 z-[9999]">
                    <div className="flex flex-col gap-[4px] pr-4">
                        <h3 className="text-[14px] font-bold text-black leading-tight">
                            Konfirmasi
                        </h3>
                        <p className="text-[12px] font-medium text-black leading-tight">
                            Silahkan Foto wajah terlebih dahulu dan pastikan lokasi anda sesuai dengan yang ada di maps
                        </p>
                    </div>

                    <button 
                        onClick={() => {
                            if (isConfirmed) {
                                handleFaceUpload();
                            }
                        }}

                        style={{ color: 'white'}}
                        className={`w-[120px] h-[40px] text-white rounded-[32px] font-bold text-[12px] flex items-center justify-center transition-all duration-300
                        ${isConfirmed ? 'bg-[#F4840B] hover:bg-orange-600' : 'bg-[#797978] cursor-not-allowed'}`}
                    >
                        Konfirmasi
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AttendanceCapture