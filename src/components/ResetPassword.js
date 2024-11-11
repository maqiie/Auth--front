import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import axios from "../axiosConfig"; // assuming axios is set up correctly

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(""); // New state for success message
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const resetToken = query.get("reset_password_token");

  // Handle password reset form submission
  const handleResetPassword = async (event) => {
    event.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.", {
        position: "top-center",
        autoClose: 5000,
      });
      return;
    }

    // Check if password is at least 8 characters long
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.", {
        position: "top-center",
        autoClose: 5000,
      });
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(""); // Clear success message when starting the reset process

    try {
      const response = await axios.put("/auth/password", {
        user: {
          password,
          password_confirmation: confirmPassword,
          reset_password_token: resetToken,
        },
      });

      if (response.status === 200) {
        setSuccess("Password reset successful! You can now log in.");
        toast.success("Password reset successful! You can now log in.", {
          position: "top-center",
          autoClose: 5000,
        });
        navigate("/login");
      } else {
        setError("Password reset failed. Please try again.");
        toast.error("Password reset failed. Please try again.", {
          position: "top-center",
          autoClose: 5000,
        });
      }
    } catch (error) {
      console.error("Error during password reset:", error);
      setError("Password reset failed. Please try again.");
      toast.error("Password reset failed. Please try again.", {
        position: "top-center",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto my-10 p-8 bg-white rounded-xl shadow-xl max-w-md">
      <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">Reset Password</h2>

      {/* Success Alert */}
      {success && (
        <div className="mb-5 p-4 bg-green-200 text-green-700 border border-green-300 rounded-lg">
          <strong>{success}</strong>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="mb-5 p-4 bg-red-200 text-red-700 border border-red-300 rounded-lg">
          <strong>{error}</strong>
        </div>
      )}

      <form onSubmit={handleResetPassword}>
        <div className="mb-5">
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
          />
        </div>
        <div className="mb-5">
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full p-4 text-lg font-semibold text-white rounded-lg transition duration-300 ease-in-out ${
            loading
              ? "bg-gray-400"
              : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          }`}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
};

export default ResetPassword;
