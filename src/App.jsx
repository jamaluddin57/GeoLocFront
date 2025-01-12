import React, { useState } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Dashboard from './pages/Dashboard';
import FilterPage from './pages/FilterPage';
import MapPage from './pages/MapPage';
import ImportDataPage from './pages/ImportDataPage';
import UserManagementPage from './pages/UserManagementPage';
import ExportDataPage from './components/ExportButton/ExportDataPage';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import GeocodePage from './pages/GeocodePage';
import { useDispatch } from 'react-redux';
import { clearAuthData } from './features/auth/authSlice';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const dispatch=useDispatch();
  const handleSignOut = () => {
    dispatch(clearAuthData());
    setIsSignOutPopupOpen(false); // Close the popup after sign-out
  };
  const [isSignOutPopupOpen,setIsSignOutPopupOpen]=useState(false);
  return (
    <Router>
      <div className="flex flex-col md:flex-row min-h-screen">
        <div className="flex-1 flex flex-col">
          <Header setIsSignOutPopupOpen={setIsSignOutPopupOpen} />
          <div className="flex flex-grow">
            <main className="flex-grow p-4">
              {/* Sign Out Confirmation Popup */}
              <AnimatePresence>
                {isSignOutPopupOpen && (
                  <motion.div
                    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                    style={{ backdropFilter: 'blur(5px)' }} // Optional for a blur effect
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <motion.div
                      className="bg-white p-6 rounded shadow-lg max-w-sm w-full"
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0.8 }}
                    >
                      <h2 className="text-lg font-bold mb-4">Confirm Sign Out</h2>
                      <p className="mb-4">Are you sure you want to sign out?</p>
                      <div className="flex justify-end space-x-4">
                        <button
                          onClick={() => setIsSignOutPopupOpen(false)}
                          className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition duration-300"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleSignOut}
                          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
                        >
                          Sign Out
                        </button>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
              <Routes>
                <Route path="/" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
                <Route path="/login" element={<Login />} />
                <Route
                  path="/filter"
                  element={
                    <ProtectedRoute>
                      <FilterPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/user-management"
                  element={
                    <ProtectedRoute>
                      <UserManagementPage />
                    </ProtectedRoute>
                  }
                />
                <Route path="/map" element={<ProtectedRoute><MapPage /></ProtectedRoute>} />
                <Route path="/import" element={<ProtectedRoute><ImportDataPage /></ProtectedRoute>} />
                <Route path="/geocode" element={<ProtectedRoute><GeocodePage /></ProtectedRoute>} />
              </Routes>
            </main>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
