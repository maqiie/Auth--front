import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig'; // Adjust this path to your axios config
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  // New state for errors
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;  // Flag to track if the component is still mounted
  
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) {
          console.log('No token found, redirecting to login');
          navigate('/');
          return;
        }
  
        const userResponse = await axios.get('/auth/validate_token', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
  
        if (isMounted) {
          console.log('User data fetched:', userResponse.data);  // Debugging log
          setUserDetails(userResponse.data);  // Only update state if component is still mounted
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        setError('Failed to fetch user details. Please try again.');
        navigate('/login');
      } finally {
        if (isMounted) setLoading(false);
      }
    };
  
    fetchData();
  
    return () => {
      isMounted = false;  // Cleanup function to avoid state updates after unmount
    };
  }, [navigate]);

  const getGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return 'Good Morning';
    if (hours < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const handleLogout = async () => {
    try {
      await axios.delete('/auth/logout');
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete('/auth/delete_account');
      navigate('/login');
    } catch (error) {
      console.error('Error deleting account:', error);
    }
  };

  const recentActivity = [
    { title: 'Updated Profile Picture', date: '2024-11-10' },
    { title: 'Added New Task', date: '2024-11-09' },
    { title: 'Logged In', date: '2024-11-08' }
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="container mx-auto space-y-8">
        {userDetails ? (
          <div className="bg-white shadow-xl rounded-lg p-8">
            <h1 className="text-4xl font-bold text-indigo-600 mb-4">
              {getGreeting()}, {userDetails.name || userDetails.email}!
            </h1>

            <div className="mb-6 flex items-center space-x-6">
              <img
                src={userDetails.profile_picture || "https://via.placeholder.com/150"}
                alt={userDetails.name || 'Profile'}
                className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500 shadow-lg"
              />
              <div>
                <h2 className="text-xl font-semibold text-gray-800">Your Profile</h2>
                <p className="text-lg text-gray-600">Name: {userDetails.name || 'John Doe'}</p>
                <p className="text-lg text-gray-600">Email: {userDetails.email || 'john.doe@example.com'}</p>
              </div>
            </div>

            <div className="flex space-x-6 mt-6">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transform transition duration-200 hover:scale-105"
                onClick={handleLogout}
              >
                Log Out
              </button>
              <button
                className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-6 rounded-lg shadow-lg transform transition duration-200 hover:scale-105"
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
            </div>
          </div>
        ) : (
          <div className="text-red-500 text-center">{error || 'Failed to fetch user details. Please try again.'}</div>
        )}

        <div className="bg-white shadow-xl rounded-lg p-6 mt-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
          <ul className="space-y-4">
            {recentActivity.map((activity, index) => (
              <li key={index} className="flex justify-between items-center text-gray-600">
                <span>{activity.title}</span>
                <span className="text-sm text-gray-400">{activity.date}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
