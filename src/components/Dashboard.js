import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig'; // Adjust this path to your axios config
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [userDetails, setUserDetails] = useState(null);
  const [tasks, setTasks] = useState([]); // Example of tasks section
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user details
        const userResponse = await axios.get('/auth/user');
        setUserDetails(userResponse.data);

        // Fetch user tasks or any other data you need
        const tasksResponse = await axios.get('/tasks'); // Adjust endpoint to your API
        setTasks(tasksResponse.data); // Assuming your tasks come from here
      } catch (error) {
        console.error('Error fetching data:', error);
        navigate('/'); // Redirect to login if any data fetch fails
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  if (loading) {
    return <div className="text-center text-lg">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="container mx-auto">
        {userDetails ? (
          <div className="bg-white shadow-md rounded-lg p-6">
            <h1 className="text-3xl font-bold mb-6">Welcome, {userDetails.name || userDetails.email}!</h1>
            
            {/* Recent Tasks Section */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-4">Your Recent Tasks</h2>
              {tasks.length > 0 ? (
                <ul className="space-y-2">
                  {tasks.map((task) => (
                    <li key={task.id} className="bg-gray-100 p-3 rounded-lg shadow-md">
                      <h3 className="font-semibold text-lg">{task.title}</h3>
                      <p className="text-gray-500">Due: {new Date(task.due_date).toLocaleDateString()}</p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No tasks available.</p>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex justify-between mt-6">
              <button 
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                onClick={() => navigate('/tasks/new')}
              >
                Add New Task
              </button>
              <button 
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
                onClick={() => navigate('/profile')}
              >
                View Profile
              </button>
            </div>

          </div>
        ) : (
          <div className="text-red-500">Failed to fetch user details. Please try again.</div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
