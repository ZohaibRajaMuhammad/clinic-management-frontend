"use client";
import { useState } from "react";
import { Eye, EyeOff, Upload } from "lucide-react";
import Link from "next/link";
import { loginApi, signupApi } from "@/services/authapi";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";
import toast from "react-hot-toast";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const {login} = useAuthContext();
  const [loading, setLoading] = useState(false)

  

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

   

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email || !emailRegex.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!form.password || form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

   

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    
    try {
      setLoading(true) 
      const response = await loginApi(form);
     
      
      if (response.data) {
        router.push("/dashboard");
        login(response.token)
        toast.success('Login sucessfully')
      }
    } catch (error) {
      console.error("signin  API error, try again:", error.message);
    }
    finally{
      setLoading(false)
    }
  };

  return (
    <div className="flex-1 max-w-lg">
      <div className="text-foreground">
        {/* Title */}
        <h2 className="text-4xl font-bold mb-8">Welcome Login </h2>

      

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
        

          {/* Email */}
          <div>
            <label className="block text-xs text-foreground/60 mb-1 ml-1">
              Email Address
            </label>
            <input
              type="email"
              placeholder="abc@gmail.com"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className="w-full bg-gray-100 border-0 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition text-foreground"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
            {/* Password  */}

            <div className="flex-1 relative">
              <label className="block text-xs text-foreground/60 mb-1 ml-1">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••••••"
                value={form.password}
                onChange={(e) => handleChange("password", e.target.value)}
                className="w-full bg-gray-100 border-0 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition pr-10 text-foreground"
              />
              <span
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-9 cursor-pointer text-foreground/50"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </span>
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <Link href="/forgetpassword" className="text-right cursor-pointer text-primary/80 tracking-wide"> forgotpassword?</Link>
         

        

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-3 bg-primary text-white font-semibold rounded-lg hover:opacity-90 transition mt-2
             ${loading ? "cursor-not-allowed bg-primary/70" : "cursor-pointer"}`}
            disabled={loading}
          >
             {!loading ? "Login" : "Loading..."}
          </button>

          {/* Sign In Link */}
          <div className="text-center">
           dont have an account {" "}
            <Link
              href="/signup"
              className=" text-sm text-primary"
            >
              Signup
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
