import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig'; // Adjust this path to your axios config
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user details when component mounts
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get('/auth/user'); // Assuming your API returns the logged-in user's details
        setUserDetails(response.data); // Update with actual user data structure from your API
      } catch (error) {
        console.error('Error fetching user details:', error);
        navigate('/login'); // Redirect to login if unable to fetch user details
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, [navigate]);

  if (loading) {
    return <div className="text-center text-lg">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {userDetails ? (
        <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome, {userDetails.name || userDetails.email}!</h1>
          <p className="text-gray-600">
            You have successfully logged in. Explore your dashboard and manage your tasks.
          </p>
          {/* Add more sections to the dashboard here */}
        </div>
      ) : (
        <div className="text-red-500">Failed to fetch user details. Please try again.</div>
      )}
    </div>
  );
};

export default Dashboard;
