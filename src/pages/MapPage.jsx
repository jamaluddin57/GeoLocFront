import React, { useMemo } from 'react';
import useGetContacts from '../hooks/useGetContacts'; // Import the custom hook
import Map from '../components/Map/Map';
import { motion } from 'framer-motion';

const parseCSVData = (csvData) => {
  const rows = csvData.split('\r').map((row) => row.trim());
  const headers = rows[0].split(',');
  const latIndex = headers.indexOf('Latitude');
  const lonIndex = headers.indexOf('Longitude');
  const phoneIndex = headers.indexOf('Phone Number');
  const firstNameIndex = headers.indexOf('First Name');
  const lastNameIndex = headers.indexOf('Last Name');
  const cityIndex = headers.indexOf('City');
  const stateIndex = headers.indexOf('State');
  const zipIndex = headers.indexOf('Zip Code');

  return rows
    .slice(1)
    .map((row) => row.split(','))
    .filter((cols) => cols.length >= headers.length)
    .map((cols, index) => {
      const lat = parseFloat(cols[latIndex]);
      const lon = parseFloat(cols[lonIndex]);

      return {
        id: cols[phoneIndex] || `${index}-${cols[latIndex] || ''}-${cols[lonIndex] || ''}`,
        firstName: cols[firstNameIndex] || 'N/A',
        lastName: cols[lastNameIndex] || 'N/A',
        phone: cols[phoneIndex] || 'N/A',
        city: cols[cityIndex] || 'N/A',
        state: cols[stateIndex] || 'N/A',
        zip: cols[zipIndex] || 'N/A',
        lat: isNaN(lat) ? null : lat,
        lon: isNaN(lon) ? null : lon,
      };
    }).filter((contact) => contact.lat && contact.lon);
};

const MapPage = () => {
  const { data, error, isLoading } = useGetContacts();
  const markers = useMemo(() => {
    if (data) {
      return parseCSVData(data);
    }
    return [];
  }, [data]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <motion.div
          className="w-16 h-16 border-4 border-t-4 border-t-blue-500 border-gray-300 rounded-full animate-spin"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        />
        <p className="absolute mt-24 text-white text-lg font-semibold">Loading map...</p>
      </div>
    );
  }

  if (error) {
    return <div>Error loading contacts: {error.message}</div>;
  }

  return (
    <motion.div
      className="relative flex flex-col items-start justify-between p-6 gap-6 mt-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex-grow w-full h-[600px] shadow-lg border rounded-lg overflow-hidden">
        <Map
          markers={markers}
          onDrawGeoJson={() => {}}
          canDraw={false}
        />
      </div>
    </motion.div>
  );
};

export default MapPage;
