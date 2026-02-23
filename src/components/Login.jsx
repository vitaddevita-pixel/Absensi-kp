import { useState } from "react"; 
import { Eye, EyeOff, LogIn } from "lucide-react"; 
import { useNavigate } from "react-router-dom";
import ilustrasi from "../assets/ilustration.svg";
import logo from "../assets/logoAbsensi.svg";
import { loginUser } from "../services/authService";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [userId, setUserId] = useState("");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

  try {
    const response = await loginUser(userId, token) 

    localStorage.setItem("user_data", JSON.stringify(response.data || response));

    alert("Login Berhasil!");

    navigate("/history");
  } catch (err) {
    setError(err.message || "Login Gagal");
    alert("Gagal Login: " + err.message);
  } finally {
    setLoading(false);
  } 
};
  

  return (
    <div className="w-full flex items-center justify-center bg-white font-sans">
      <div className="flex w-full max-w-[1440px] min-h-screen items-center">
        
        {/* Bagian Kiri*/}
        <div className="flex w-1/2 items-center justify-center p-4 bg-gray-50">
          <img 
            src={ilustrasi} 
            alt="ilustration" 
            className="w-full max-w-[500px] h-auto object-contain"
          
          />
        </div>

        {/* Bagian Kanan*/}
        <div className="flex-1 flex flex-col justify-center items-center lg:items-start px-8 lg:px-24">
          <div className="w-full max-w-[350px]">
             {/* Logo Section */}
             <div className="mb-[40px]">
             <img 
              src={logo} 
              alt="Logo" 
              style={{ width: '280.57px', height: '78px'}}
              className="object-contain"
             />
              </div>

             {/* Form Section */}
          <div className="w-full max-w-[350px]">
            <h2 className="text-[18px] font-bold text-gray-800 mb-[24px] text-left leading-[100%]">Login</h2>
            
            <form className="space-y-[16px]" onSubmit={handleLogin}>
              <div className="flex flex-col gap-[8px]">
                <label className="text-[14px] font-[500] text-[#BABABA]">Username</label>
                <div className="relative flex items-center">
                   <input 
                  type="text" 
                  placeholder="Input..." 
                  className="w-full h-[44px] px-[14px] rounded-[16px] border 
                  border-[#D1D1D1] outline-none focus:ring-1 focus:ring-orange-500 transition-all text-[14px] placeholder:text-[#BABABA]"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  required
                />
                </div>
              </div>

              <div className="flex flex-col gap-[8px]">
                <label className="text-[14px] font-[500] text-[#BABABA]">Password</label>
                <div className="relative flex items-center">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Input..." 
                    className="w-full h-[44px] px-[14px] rounded-[16px] border
                     border-[#D1D1D1] outline-none focus:ring-1 focus:ring-orange-500 transition-all text-[14px] placeholder: text-black"
                     value={token}
                    onChange={(e) => setToken(e.target.value)}
                    required
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-[14px] bg-transparent border-none p-0 outline-none text-black transition-colors "
                  >
                    {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </button>
                </div>
              </div>

              {error && <p className="text-red-600 text-xs font-medium">{error}</p>}

              <button 
                type="submit"
                className="w-full h-[44px] bg-[#E9830E] hover:bg-orange-600 rounded-[32px]
                flex items-center justify-center gap-2 px-[24px] mt-4
                text-white font-bold text-[14px] border-0 shadow-none outline-none focus:outline-none focus: active: scale-[0.98] transition-all">
                <div className="bg-white p-1 rounded-lg">
                  <LogIn size={18} color="white"/>
                </div>
                <span className="flex-1 text-center !text-white font-bold text-[14px]">
                  {loading ? "Loading..." : "Login"}
                  </span>
                
              </button>
            </form>
          </div>
          </div>        
        </div>
      </div>
    </div>
  );
};

export default Login;