"use client";
import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import { resetPasswordApi } from "@/services/authapi";
import { useAuthContext } from "@/context/AuthContext";

export default function Resetpassword() {
  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // ✅ separate toggle
  const [errors, setErrors] = useState({});

  const router = useRouter();
  const { resetToken } = useParams(); 

 

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  // ✅ Validation
  const validateForm = () => {
    const newErrors = {};

    if (!form.password || form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    if (!resetToken) {
      console.error("Reset token missing in URL");
      setErrors({ token: "Invalid or missing reset token." });
      return;
    }

    try {
      const response = await resetPasswordApi(form.password, resetToken);
     
      
      if (response?.message === "Password successfully reset!") {
        router.push("/login"); // ✅ redirect to login
      } else {
        console.error("Unexpected response:", response);
      }
    } catch (error) {
      console.error("Reset password API error:", error.message);
    }
  };

  return (
    <div className="flex-1 max-w-lg">
      <div className="text-foreground">
        {/* Title */}
        <h2 className="text-4xl font-bold mb-8">Reset Password</h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          {/* Password */}
          <div className="flex-1 relative">
            <label className="block text-xs text-foreground/60 mb-1 ml-1">
              New Password
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

          {/* Confirm Password */}
          <div className="flex-1 relative">
            <label className="block text-xs text-foreground/60 mb-1 ml-1">
              Confirm Password
            </label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="••••••••••••"
              value={form.confirmPassword}
              onChange={(e) =>
                handleChange("confirmPassword", e.target.value)
              }
              className="w-full bg-gray-100 border-0 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition pr-10 text-foreground"
            />
            <span
              onClick={() =>
                setShowConfirmPassword(!showConfirmPassword)
              }
              className="absolute right-3 top-9 cursor-pointer text-foreground/50"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          {errors.token && (
            <p className="text-red-500 text-sm mt-1">{errors.token}</p>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:opacity-90 transition mt-2"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
