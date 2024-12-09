import React from 'react';
import { motion } from 'framer-motion';
import { useGetMetricsQuery } from '../features/api/apiSlice'; // Adjust the import path based on your project structure

const Dashboard = () => {
  const { data: metrics, isLoading, isError } = useGetMetricsQuery();

  const containerVariants = {
    hidden: { opacity: 0, x: '-100vw' },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: 'spring',
        stiffness: 50,
        damping: 10,
        staggerChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 50,
      },
    },
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !metrics) {
    return <div>Failed to load metrics</div>;
  }

  return (
    <motion.div
      className="container mx-auto mt-20 p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <h1 className="text-3xl font-bold mb-6 text-center">
        Dashboard Overview
      </h1>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={itemVariants}
      >
        {/* Export Data Count Card */}
        <motion.div
          className="bg-white h-40 p-10 shadow-md rounded-lg hover:shadow-xl transition-shadow duration-300"
          whileHover={{ scale: 1.05 }}
        >
          <h2 className="text-xl font-semibold mb-2">Exported Data</h2>
          <p className="text-gray-600">{metrics.exportCount} Records exported</p>
        </motion.div>

        {/* Import Data Count Card */}
        <motion.div
          className="bg-white h-40 p-10 shadow-md rounded-lg hover:shadow-xl transition-shadow duration-300"
          whileHover={{ scale: 1.05 }}
        >
          <h2 className="text-xl font-semibold mb-2">Imported Data Count</h2>
          <p className="text-gray-600">{metrics.importCount} data entries imported</p>
        </motion.div>

        {/* User Count Card */}
        <motion.div
          className="bg-white h-40 p-10 shadow-md rounded-lg hover:shadow-xl transition-shadow duration-300"
          whileHover={{ scale: 1.05 }}
        >
          <h2 className="text-xl font-semibold mb-2">Total Users</h2>
          <p className="text-gray-600">{metrics.userCount} users</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;
