// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import axios from "../axiosConfig";
// import axiosInstance from "../axiosConfig";
// import "./Login.css";

// const Login = ({ setCurrentUser }) => { // Access setCurrentUser as a prop here
//   const [isRegistering, setIsRegistering] = useState(false);
//   const [is2FA, setIs2FA] = useState(false);
//   const [forgotPassword, setForgotPassword] = useState(false);
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");
//   const [otpCode, setOtpCode] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [timer, setTimer] = useState(60); // OTP timer (60 seconds)
//   const [canResend, setCanResend] = useState(false); // Can resend OTP
//   const navigate = useNavigate();

//   // Handle login form submission
//   const handleLogin = async (event) => {
//     event.preventDefault();
//     setLoading(true);
//     setError("");
  
//     try {
//       const response = await axios.post("/auth/sign_in", { email, password });
//       console.log("Login response:", response);  // Log the response here
  
//       if (response.status === 200) {
//         setIs2FA(true);
//         toast.info("OTP has been sent to your email. Please enter it below.");
//         startOtpTimer();
//       } else {
//         setError("Login failed. Please check your credentials and try again.");
//         toast.error("Login failed. Please check your credentials and try again.");
//       }
//     } catch (error) {
//       console.error("Error during login:", error);
//       if (error.response) {
//         setError(
//           error.response.data.message ||
//             "Login failed. Please check your credentials and try again."
//         );
//       } else {
//         setError("Login failed. Please check your credentials and try again.");
//       }
//       toast.error(
//         error.response?.data?.message ||
//           "Login failed. Please check your credentials and try again."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };
  

//   const startOtpTimer = () => {
//     const intervalId = setInterval(() => {
//       setTimer((prevTime) => {
//         if (prevTime <= 1) {
//           clearInterval(intervalId);
//           setCanResend(true); // Allow resending OTP after the timer ends
//           return 0;
//         }
//         return prevTime - 1;
//       });
//     }, 1000);
//   };

//   // // Handle OTP verification
//   // const handleOtpVerification = async (event) => {
//   //   event.preventDefault();
//   //   setLoading(true);
//   //   setError("");

//   //   try {
//   //     const response = await axios.post("/auth/verify_otp", {
//   //       email,
//   //       otp: otpCode,
//   //     });

//   //     if (response.status === 200) {
//   //       handleSuccessfulLogin(response.data);
//   //     } else {
//   //       setError("Invalid OTP or session expired.");
//   //       toast.error("Invalid OTP or session expired.");
//   //     }
//   //   } catch (error) {
//   //     console.error("Error with OTP verification:", error);
//   //     setError("Invalid OTP or session expired.");
//   //     toast.error("Invalid OTP or session expired.");
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

  
//   // const handleSuccessfulLogin = (data) => {
//   //   const { "access-token": accessToken, client, uid } = data;
  
//   //   // Store tokens in localStorage
//   //   localStorage.setItem("access-token", accessToken);  // Corrected key for localStorage
//   //   localStorage.setItem("client", client);
//   //   localStorage.setItem("uid", uid);
  
//   //   // Set axios default headers for future authenticated requests
//   //   axios.defaults.headers.common["access-token"] = accessToken;
//   //   axios.defaults.headers.common["client"] = client;
//   //   axios.defaults.headers.common["uid"] = uid;
  
//   //   // Navigate to the dashboard after login
//   //   navigate("/dashboard");
//   // };
//   // Handle OTP verification
//   const handleOtpVerification = async (event) => {
//     event.preventDefault();
//     setLoading(true);
//     setError("");
  
//     try {
//       const response = await axios.post("/auth/verify_otp", {
//         email,
//         otp: otpCode,
//       });
//       console.log("OTP verification response:", response);  // Log the OTP verification response
  
//       if (response.status === 200) {
//         handleSuccessfulLogin(response.data);
//       } else {
//         setError("Invalid OTP or session expired.");
//         toast.error("Invalid OTP or session expired.");
//       }
//     } catch (error) {
//       console.error("Error with OTP verification:", error);
//       setError("Invalid OTP or session expired.");
//       toast.error("Invalid OTP or session expired.");
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   // Function to handle successful login
//   const handleSuccessfulLogin = (data) => {
//     console.log("Login successful, data received:", data);  // Log the successful login data
  
//     const { "access-token": accessToken, client, uid } = data;
  
//     // Store tokens in localStorage
//     localStorage.setItem("access-token", accessToken);
//     localStorage.setItem("client", client);
//     localStorage.setItem("uid", uid);
  
//     // Set axios default headers for future authenticated requests
//     axios.defaults.headers.common["access-token"] = accessToken;
//     axios.defaults.headers.common["client"] = client;
//     axios.defaults.headers.common["uid"] = uid;
  
//     // Update currentUser state in App.js
//     setCurrentUser({ uid, client }); // Set currentUser state here

//     // Navigate to the dashboard
//     console.log("Navigating to dashboard...");
//     navigate("/dashboard");
//   };

  
//   // Handle resending OTP
//   const handleResendOtp = async () => {
//     if (canResend) {
//       try {
//         const response = await axios.post("/auth/resend_otp", { email });

//         if (response.status === 200) {
//           toast.info("OTP has been resent to your email.");
//           setTimer(60); // Reset the timer to 60 seconds
//           startOtpTimer(); // Start the countdown again
//           setCanResend(false); // Disable resend button until next timer expiration
//         } else {
//           toast.error("Failed to resend OTP. Please try again.");
//         }
//       } catch (error) {
//         console.error("Error while resending OTP:", error);
//         toast.error("Failed to resend OTP. Please try again.");
//       }
//     } else {
//       toast.warning(
//         "Please wait for the timer to expire before resending OTP."
//       );
//     }
//   };

//   const handleRegister = async (event) => {
//     event.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const response = await axios.post("/auth", {
//         user: {
//           email: email,
//           password: password,
//           password_confirmation: confirmPassword,
//         },
//       });
//       if (response.status === 200) {
//         toast.success("Registration successful! You can now log in.");
//         setIsRegistering(false);
//       } else {
//         setError("Registration failed. Please try again.");
//         toast.error("Registration failed. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error during registration:", error);
//       setError("Registration failed. Please try again.");
//       toast.error("Registration failed. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleForgotPassword = async (event) => {
//     event.preventDefault();
//     setLoading(true);
//     setError("");

//     try {
//       const response = await axiosInstance.post("/auth/password", {
//         user: {
//           email: email,
//         },
//       });

//       if (response.status === 200 || response.status === 303) {
//         // Treat 303 as success too
//         toast.success("Password reset link has been sent to your email.");
//         setEmail("");
//         setForgotPassword(false); // Optionally hide the form
//       } else {
//         setError("Unable to send password reset link. Please try again.");
//         toast.error("Unable to send password reset link. Please try again.");
//       }
//     } catch (error) {
//       console.error("Error during password reset:", error);
//       setError("Unable to send password reset link. Please try again.");
//       toast.error("Unable to send password reset link. Please try again.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="container">
//       <ToastContainer />
//       {!is2FA && !forgotPassword ? (
//         <div className="form-container">
//           {!isRegistering ? (
//             <>
//               <h2>Login</h2>
//               <form onSubmit={handleLogin}>
//                 <input
//                   type="email"
//                   placeholder="Email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                 />
//                 <input
//                   type="password"
//                   placeholder="Password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                 />
//                 <button type="submit" disabled={loading}>
//                   {loading ? "Logging in..." : "Login"}
//                 </button>
//               </form>
//               <p>
//                 Don't have an account?{" "}
//                 <span onClick={() => setIsRegistering(true)}>
//                   Register here
//                 </span>
//               </p>
//               <p>
//                 Forgot your password?{" "}
//                 <span onClick={() => setForgotPassword(true)}>
//                   Reset password
//                 </span>
//               </p>
//               {error && <p className="error">{error}</p>}
//             </>
//           ) : (
//             <>
//               <h2>Register</h2>
//               <form onSubmit={handleRegister}>
//                 <input
//                   type="email"
//                   placeholder="Email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                 />
//                 <input
//                   type="text"
//                   placeholder="Name"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)} // Update to a separate name state if needed
//                   required
//                 />
//                 <input
//                   type="password"
//                   placeholder="Password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                 />
//                 <input
//                   type="password"
//                   placeholder="Confirm Password"
//                   value={confirmPassword}
//                   onChange={(e) => setConfirmPassword(e.target.value)}
//                   required
//                 />
//                 <button type="submit" disabled={loading}>
//                   {loading ? "Registering..." : "Register"}
//                 </button>
//               </form>
//               <p>
//                 Already have an account?{" "}
//                 <span onClick={() => setIsRegistering(false)}>Login here</span>
//               </p>
//               {error && <p className="error">{error}</p>}
//             </>
//           )}
//         </div>
//       ) : (
//         <div className="form-container">
//           {forgotPassword ? (
//             <>
//               <h2>Reset Password</h2>
//               <form onSubmit={handleForgotPassword}>
//                 <input
//                   type="email"
//                   placeholder="Email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   required
//                 />
//                 <button type="submit" disabled={loading}>
//                   {loading ? "Sending..." : "Send Reset Link"}
//                 </button>
//               </form>
//               {error && <p className="error">{error}</p>}
//             </>
//           ) : (
//             <>
//               <h2>Enter OTP</h2>
//               <form onSubmit={handleOtpVerification}>
//                 <input
//                   type="text"
//                   placeholder="Enter OTP"
//                   value={otpCode}
//                   onChange={(e) => setOtpCode(e.target.value)}
//                   required
//                 />
//                 <button type="submit" disabled={loading}>
//                   {loading ? "Verifying..." : "Verify OTP"}
//                 </button>
//                 <p>
//                   Resend OTP?{" "}
//                   {canResend ? (
//                     <span onClick={handleResendOtp}>Click here</span>
//                   ) : (
//                     `Wait ${timer}s`
//                   )}
//                 </p>
//               </form>
//               {error && <p className="error">{error}</p>}
//             </>
//           )}
//         </div>
//       )}
//     </div>
//   );
// };

// export default Login;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "../axiosConfig";
import axiosInstance from "../axiosConfig";
import "./Login.css";

const Login = ({ setCurrentUser }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [is2FA, setIs2FA] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");  // Error state
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError(""); // Reset error message before checking login credentials
  
    if (!email || !password) {
      setError("Email and password are required.");
      setLoading(false);
      return;
    }
  
    try {
      const response = await axios.post("/auth/sign_in", { email, password });
      console.log("Login response:", response);
  
      if (response.status === 200) {
        setIs2FA(true);
        toast.info("OTP has been sent to your email. Please enter it below.");
        startOtpTimer();
      } else {
        setError("Login failed. Please check your credentials and try again.");
        toast.error("Login failed. Please check your credentials and try again.");
      }
    } catch (error) {
      console.error("Error during login:", error);
      setError("Invalid email or password.");
      toast.error("Invalid email or password.");
    } finally {
      setLoading(false);
    }
  };
  
  

  const startOtpTimer = () => {
    const intervalId = setInterval(() => {
      setTimer((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(intervalId);
          setCanResend(true);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
  };

  const handleOtpVerification = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("/auth/verify_otp", { email, otp: otpCode });
      console.log("OTP verification response:", response);

      if (response.status === 200) {
        handleSuccessfulLogin(response.data);
      } else {
        setError("Invalid OTP or session expired.");
        toast.error("Invalid OTP or session expired.");
      }
    } catch (error) {
      console.error("Error with OTP verification:", error);
      setError("Invalid OTP or session expired.");
      toast.error("Invalid OTP or session expired.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessfulLogin = (data) => {
    console.log("Login successful, data received:", data);
    const { "access-token": accessToken, client, uid } = data;

    localStorage.setItem("access-token", accessToken);
    localStorage.setItem("client", client);
    localStorage.setItem("uid", uid);

    axios.defaults.headers.common["access-token"] = accessToken;
    axios.defaults.headers.common["client"] = client;
    axios.defaults.headers.common["uid"] = uid;

    setCurrentUser({ uid, client });
    navigate("/dashboard");
  };

  const handleResendOtp = async () => {
    if (canResend) {
      try {
        const response = await axios.post("/auth/resend_otp", { email });

        if (response.status === 200) {
          toast.info("OTP has been resent to your email.");
          setTimer(60);
          startOtpTimer();
          setCanResend(false);
        } else {
          toast.error("Failed to resend OTP. Please try again.");
        }
      } catch (error) {
        console.error("Error while resending OTP:", error);
        toast.error("Failed to resend OTP. Please try again.");
      }
    } else {
      toast.warning("Please wait for the timer to expire before resending OTP.");
    }
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    if (!email || !password || !confirmPassword) {
      setError("Please fill in all the fields.");
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("/auth", {
        user: { email, password, password_confirmation: confirmPassword },
      });

      if (response.status === 200) {
        toast.success("Registration successful! You can now log in.");
        setIsRegistering(false);
      } else {
        setError("Registration failed. Please try again.");
        toast.error("Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Error during registration:", error);
      setError("Registration failed. Please try again.");
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    if (!email) {
      setError("Email is required.");
      setLoading(false);
      return;
    }

    try {
      const response = await axiosInstance.post("/auth/password", { user: { email } });

      if (response.status === 200 || response.status === 303) {
        toast.success("Password reset link has been sent to your email.");
        setEmail("");
        setForgotPassword(false);
      } else {
        setError("Unable to send password reset link. Please try again.");
        toast.error("Unable to send password reset link. Please try again.");
      }
    } catch (error) {
      console.error("Error during password reset:", error);
      setError("Unable to send password reset link. Please try again.");
      toast.error("Unable to send password reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <ToastContainer />
      {!is2FA && !forgotPassword ? (
        <div className="form-container">
          {!isRegistering ? (
            <>
              <h2>Login</h2>
              <form onSubmit={handleLogin}>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="submit" disabled={loading}>
                  {loading ? "Logging in..." : "Login"}
                </button>
              </form>
              <p>
                Don't have an account?{" "}
                <span onClick={() => setIsRegistering(true)}>Register here</span>
              </p>
              <p>
                Forgot your password?{" "}
                <span onClick={() => setForgotPassword(true)}>Reset password</span>
              </p>

              {/* Show error message here */}
              {error && (
                <div className="error-alert">
                  <p>{error}</p>
                </div>
              )}
            </>
          ) : (
            <>
              <h2>Register</h2>
              <form onSubmit={handleRegister}>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                <button type="submit" disabled={loading}>
                  {loading ? "Registering..." : "Register"}
                </button>
              </form>
              <p>
                Already have an account?{" "}
                <span onClick={() => setIsRegistering(false)}>Login here</span>
              </p>
              {error && (
                <div className="error-alert">
                  <p>{error}</p>
                </div>
              )}
            </>
          )}
        </div>
      ) : is2FA ? (
        <div className="form-container">
          <h2>Enter OTP</h2>
          <form onSubmit={handleOtpVerification}>
            <input
              type="text"
              placeholder="OTP Code"
              value={otpCode}
              onChange={(e) => setOtpCode(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>
          </form>
          <p>
            Resend OTP in {timer}s{" "}
            <span onClick={handleResendOtp} style={{ cursor: "pointer", color: canResend ? "blue" : "gray" }}>
              {canResend ? "Resend OTP" : ""}
            </span>
          </p>
          {error && <p className="error">{error}</p>}
        </div>
      ) : forgotPassword ? (
        <div className="form-container">
          <h2>Forgot Password</h2>
          <form onSubmit={handleForgotPassword}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
          {error && <p className="error">{error}</p>}
        </div>
      ) : null}
    </div>
  );
};

export default Login;
