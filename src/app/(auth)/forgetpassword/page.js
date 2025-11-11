"use client";
import { useState } from "react";
import { Eye, EyeOff, Upload, X, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { forgetpasswordApi } from "@/services/authapi";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/context/AuthContext";

export default function ForgetPassword() {
  const [form, setForm] = useState({
    email: "",
  });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false); // ✅ new success state
  const router = useRouter();

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
      const response = await forgetpasswordApi(form);
     
      
      if (response?.message === "Sucess") {
        // ✅ show success UI if API returns success
        setSuccess(true);
      } else {
        console.error("Unexpected response:", response);
      }
    } catch (error) {
      console.error("Forget password API error:", error.message);
    }
  };

  // ✅ close success message
  const handleCloseSuccess = () => {
    setSuccess(false);
    setForm({ email: "" });
  };

  return (
    <div className="flex-1 max-w-lg">
      <div className="text-foreground">
        {/* Title */}
        <h2 className="text-4xl font-bold mb-8">Forget Password</h2>

        {/* ✅ Success Message */}
        {success ? (
          <div className="relative bg-green-50 border border-green-200 rounded-lg p-6 text-center animate-fade-in">
            <button
              onClick={handleCloseSuccess}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-green-700">
              🎉 Reset Link Sent!
            </h3>
            <p className="text-sm text-green-600 mt-1">
              We’ve sent a password reset link to{" "}
              <span className="font-medium">{form.email}</span>. <br />
              Please check your inbox to continue.
            </p>
          </div>
        ) : (
          // ✅ Default Form
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            {/* Email */}
            <div>
              <label className="block text-xs text-foreground/60 mb-1 ml-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="JohnTerner@the18.design"
                value={form.email}
                onChange={(e) => handleChange("email", e.target.value)}
                className="w-full bg-gray-100 border-0 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition text-foreground"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <p className="text-xs text-foreground/70 leading-0">
              We will send a reset link to this email address
            </p>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:opacity-90 transition mt-2"
            >
              Send Reset Link
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
