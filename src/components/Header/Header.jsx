import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

const Header = () => {
  const { permissions } = useSelector((state) => state.auth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!permissions) {
    return null; // Show nothing if permissions are not available
  }

  // Routes for specific permissions
  const adminRoutes = [
    { path: "/", label: "Dashboard" },
    { path: "/filter", label: "Filter Data" },
    // { path: "/map", label: "Map" },
    { path: "/user-management", label: "User Management" },
    { path: "/import", label: "Import Data" },
    { path: "/geocode", label: "Geocode Management" },
  ];

  const exportRoutes = [
    { path: "/", label: "Dashboard" },
    { path: "/filter", label: "Filter Data" },
    { path: "/geocode", label: "Geocode Management" },
  ];

  const importRoutes = [
    { path: "/", label: "Dashboard" },
    { path: "/import", label: "Import Data" },
    { path: "/geocode", label: "Geocode Management" },
  ];

  // Determine which routes to display
  let routes = [];
  if (permissions.includes("admin")) {
    routes = adminRoutes;
  } else if (permissions.includes("export")) {
    routes = exportRoutes;
  } else if (permissions.includes("import")) {
    routes = importRoutes;
  }

  return (
    <motion.header
      className="bg-white shadow-md fixed w-full z-10"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto h-24 flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-gray-800 hover:text-gray-600">
          GeoDataSystem
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex space-x-6 text-[18px]">
          {routes.map((route) => (
            <Link
              key={route.path}
              to={route.path}
              className="text-gray-600 hover:text-gray-900 transition duration-300"
            >
              {route.label}
            </Link>
          ))}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            className="text-gray-600 focus:outline-none focus:text-gray-900"
            onClick={() => setIsMobileMenuOpen((prev) => !prev)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
              ></path>
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          className="md:hidden bg-white shadow-lg px-6 py-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <nav className="flex flex-col space-y-4">
            {routes.map((route) => (
              <Link
                key={route.path}
                to={route.path}
                className="text-gray-600 hover:text-gray-900 transition duration-300"
                onClick={() => setIsMobileMenuOpen(false)} // Close menu on link click
              >
                {route.label}
              </Link>
            ))}
          </nav>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Header;
