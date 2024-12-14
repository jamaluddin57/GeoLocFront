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

function App() {
  return (
    <Router>
      <div className="flex flex-col md:flex-row min-h-screen">
        <div className="flex-1 flex flex-col">
          <Header />
          <div className="flex flex-grow">
            <main className="flex-grow p-4">
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
