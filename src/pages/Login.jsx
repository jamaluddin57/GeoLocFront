import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useLoginMutation } from '../features/api/apiSlice';
import { useDispatch } from 'react-redux';
import { setAuthData } from '../features/auth/authSlice';
import ErrorModal from '../components/ErrorModal';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [login, { isLoading }] = useLoginMutation();
    const [error, setError] = useState(null); // Manage error state
    const [isModalOpen, setIsModalOpen] = useState(false); // Modal visibility
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Call login mutation and unwrap the response
            const { access_token, permissions } = await login({ username, password }).unwrap();

            // Dispatch token and permissions to Redux store
            dispatch(setAuthData({ token: access_token, permissions }));

            // Navigate to the protected route (e.g., dashboard)
            navigate('/');
        } catch (err) {
            setError(err.data?.detail || 'An unexpected error occurred.');
            setIsModalOpen(true); // Open error modal
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setError(null); // Reset error state
    };

    const containerVariants = {
        hidden: { opacity: 0, scale: 0.8 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                type: 'spring',
                stiffness: 50,
                damping: 10,
            },
        },
    };

    const inputVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                type: 'spring',
                stiffness: 50,
                damping: 10,
                delay: 0.2,
            },
        },
    };

    const buttonVariants = {
        hover: {
            scale: 1.1,
            boxShadow: '0px 8px 15px rgba(0, 0, 0, 0.2)',
        },
        tap: {
            scale: 0.9,
        },
    };

    return (
        <>
            {/* Error Modal */}
            <ErrorModal
                isOpen={isModalOpen}
                onClose={closeModal}
                message={error}
            />

            <motion.div
                className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 p-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <motion.div
                    className="bg-white shadow-md rounded-lg p-8 w-full max-w-md"
                    variants={inputVariants}
                >
                    <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
                        Welcome Back
                    </h1>
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Username Input */}
                        <motion.div variants={inputVariants}>
                            <label
                                htmlFor="username"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Username
                            </label>
                            <input
                                type="text"
                                id="username"
                                placeholder="Enter your username"
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </motion.div>

                        {/* Password Input */}
                        <motion.div variants={inputVariants}>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                placeholder="Enter your password"
                                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </motion.div>

                        {/* Login Button */}
                        <motion.div variants={inputVariants}>
                            <motion.button
                                type="submit"
                                className={`w-full bg-blue-500 text-white font-bold py-3 rounded-lg shadow-md ${
                                    isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
                                } focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all`}
                                variants={buttonVariants}
                                whileHover="hover"
                                whileTap="tap"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Logging in...' : 'Login'}
                            </motion.button>
                        </motion.div>
                    </form>
                </motion.div>
            </motion.div>
        </>
    );
};

export default Login;
