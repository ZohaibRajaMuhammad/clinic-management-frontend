"use client";
import { useState } from "react";
import { Eye, EyeOff, Upload } from "lucide-react";
import Link from "next/link";
import { signupApi } from "@/services/authapi";
import { useRouter } from "next/navigation";

export default function Signup() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    gender: "",
    profileImage: null,
    role: "patient",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const router = useRouter();
  const [loading, setLoading] = useState(false)

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setForm({ ...form, profileImage: file });
      setErrors({ ...errors, profileImage: "" });
    }
  };

  const handleChange = (field, value) => {
    setForm({ ...form, [field]: value });
    setErrors({ ...errors, [field]: "" });
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    if (!form.fullName || form.fullName.trim().length < 4) {
      newErrors.fullName = "Full name must be at least 4 characters.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!form.email || !emailRegex.test(form.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!form.password || form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    const phoneRegex = /^[0-9]{10,15}$/;
    if (!form.phone || !phoneRegex.test(form.phone.replace(/[\s-]/g, ""))) {
      newErrors.phone = "Please enter a valid phone number (10-15 digits).";
    }

    if (!form.gender) {
      newErrors.gender = "Please select a gender.";
    }

    if (!form.profileImage) {
      newErrors.profileImage = "Please upload a profile image.";
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

    const formData = new FormData();
    formData.append("name", form.fullName);
    formData.append("email", form.email);
    formData.append("password", form.password);
    formData.append("phone", form.phone);
    formData.append("gender", form.gender);
    formData.append("role", form.role);
    formData.append("profileImage", form.profileImage);

    try {
      setLoading(true)
      const response = await signupApi(formData);
      
      if (response.message) {
        router.push("/login");
        toast.success('register sucessfully')
      }
    } catch (error) {
      console.error("Signup API error, try again:", error.message);
    }
    finally{
      setLoading(false)
    }
  };

  return (
    <div className="flex-1 max-w-lg">
      <div className="text-foreground">
        {/* Title */}
        <h2 className="text-4xl font-bold mb-8">Register yourself</h2>

        {/* Profile Upload */}
        <div className="relative mb-6 flex justify-center">
          <label htmlFor="profileImage" className="cursor-pointer">
            <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center relative">
              {form.profileImage ? (
                <img
                  src={URL.createObjectURL(form.profileImage)}
                  alt="Profile Preview"
                  className="w-20 h-20 rounded-full object-cover"
                />
              ) : (
                <Upload className="w-6 h-6 text-gray-400" />
              )}
            </div>
          </label>
          <input
            id="profileImage"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageUpload}
          />
          {errors.profileImage && (
            <p className="text-red-500 text-sm mt-1">{errors.profileImage}</p>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs text-foreground/60 mb-1 ml-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="John Terner"
              value={form.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              className="w-full bg-gray-100 border-0 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition text-foreground"
            />
            {errors.fullName && (
              <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
            )}
          </div>

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

          {/* Password + Phone Row */}
          <div className="flex gap-4">
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

            <div className="flex-1">
              <label className="block text-xs text-foreground/60 mb-1 ml-1">
                Phone Number
              </label>
              <input
                type="tel"
                placeholder="1234567890"
                value={form.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className="w-full bg-gray-100 border-0 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition text-foreground"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-xs text-foreground/60 mb-1 ml-1">
              Gender
            </label>
            <select
              value={form.gender}
              onChange={(e) => handleChange("gender", e.target.value)}
              className="w-full bg-gray-100 border-0 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition text-foreground"
            >
              <option value="" disabled>
                Select Gender
              </option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            {errors.gender && (
              <p className="text-red-500 text-sm mt-1">{errors.gender}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className={`w-full py-3 bg-primary text-white font-semibold rounded-lg hover:opacity-90 transition mt-2 ${loading ? "cursor-not-allowed bg-primary/70" : "cursor-pointer"}` }
            disabled={loading}
          >
          {!loading ? "Register" : "Loading..."}
          </button>

          {/* Sign In Link */}
          <div className="text-center">
            <Link
              href="/login"
              className="text-foreground/70 hover:text-foreground text-sm"
            >
              SIGN IN
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
