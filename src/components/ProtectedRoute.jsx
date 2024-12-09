import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios'; // Ensure axios is installed: npm install axios

const ProtectedRoute = ({ children, requiredPermission }) => {
  const { token, permissions } = useSelector((state) => state.auth); // Get token and permissions from Redux store
  const [isVerified, setIsVerified] = useState(null); // Tracks token verification status

  useEffect(() => {
    const verifyToken = async () => {
      try {
        // Make the API call to verify the token
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/verify-token`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include Bearer token in the header
            },
          }
        );
        if (response.status === 200) {
          setIsVerified(true); // Token verified
        }
      } catch (error) {
        console.error('Token verification failed:', error);
        setIsVerified(false); // Token invalid
      }
    };

    if (token) {
      verifyToken();
    } else {
      setIsVerified(false); // No token available
    }
  }, [token]);

  if (isVerified === null) {
    // Render a loading state while verifying the token
    return <div>Loading...</div>;
  }

  if (!isVerified) {
    // Redirect to login if token is invalid or not verified
    return <Navigate to="/login" replace />;
  }

  // Check permissions
  if (!permissions.includes('admin') && !permissions.includes(requiredPermission)) {
    // Redirect to home page if user lacks required permission
    return <Navigate to="/" replace />;
  }

  // Render protected content if token is verified and permissions are valid
  return children;
};

export default ProtectedRoute;
