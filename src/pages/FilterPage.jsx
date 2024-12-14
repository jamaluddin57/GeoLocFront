import React, { useState } from 'react';
import { useFilterContactsMutation} from '../features/api/apiSlice';
import Map from '../components/Map/Map';
import FilterForm from '../components/FilterPanel/FilterForm';
import ErrorModal from '../components/ErrorModal';
import { motion } from 'framer-motion';

const FilterPage = () => {
    const [geoJson, setGeoJson] = useState(null);
    const [filterCriteria, setFilterCriteria] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [totalRecords, setTotalRecords] = useState(0);
    const [filteredData, setFilteredData] = useState(null);
    const [markers, setMarkers] = useState([]); // State for map markers
    const [filterContacts] = useFilterContactsMutation();

    const parseMarkers = (data) => {
        const rows = data.split('\r');
        const headers = rows[0].split(',');
    
        const latIndex = headers.indexOf('Latitude');
        const lonIndex = headers.indexOf('Longitude');
        const phoneIndex = headers.indexOf('Phone');
    
        return rows
            .slice(1) // Skip header row
            .map((row) => row.split(','))
            .filter((cols) => {
                const lat = parseFloat(cols[latIndex]);
                const lon = parseFloat(cols[lonIndex]);
                return !isNaN(lat) && !isNaN(lon); // Validate coordinates
            })
            .map((cols, index) => ({
                id: cols[phoneIndex] || `${index}-${cols[latIndex]}-${cols[lonIndex]}`, // Ensure a unique key
                lat: parseFloat(cols[latIndex]),
                lon: parseFloat(cols[lonIndex]),
            }));
    };
    
    const handleFilterSubmit = async () => {
        const combinedFilters = { ...filterCriteria, geojson: geoJson };
    
        try {
            const response = await filterContacts(combinedFilters).unwrap();
            const totalRecordsCount = parseInt(response.totalRecords || 0);
            setTotalRecords(totalRecordsCount);
            setFilteredData(response.data);
    
            // Parse markers and validate data
            const validMarkers = parseMarkers(response.data);
            setMarkers(validMarkers);
    
            setModalTitle('Success');
            setModalMessage(`${totalRecordsCount} contacts found.`);
            setIsModalOpen(true);
        } catch (error) {
            console.error('Error filtering contacts:', error);
            setModalTitle('Error');
            setModalMessage('An error occurred while filtering data. Please try again.');
            setIsModalOpen(true);
        }
    };
    

    const handleExportData = () => {
        if (filteredData) {
            const blob = new Blob([filteredData], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'filtered_contacts.csv';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }
    };

    const handleClearFilters = () => {
        setGeoJson(null);
        setFilterCriteria({});
        setTotalRecords(0);
        setFilteredData(null);
        setMarkers([]); // Clear markers
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalMessage('');
        setModalTitle('');
    };

    return (
        <motion.div
            className="relative flex flex-col md:flex-row items-start justify-between p-6 gap-6 mt-24 w-full mb-24"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <FilterForm
                onFilterSubmit={handleFilterSubmit}
                onFormChange={(criteria) => setFilterCriteria(criteria)}
                geoEnabled={!!geoJson}
            />
            <div className="flex-grow w-full h-[600px] shadow-lg border rounded-lg overflow-hidden mb-24">
                <Map
                    onDrawGeoJson={(geoData) => setGeoJson(geoData)}
                    canDraw={!geoJson}
                    markers={markers} // Pass markers to the map
                    clearFilters={handleClearFilters}
                />
            </div>

            <div className="flex justify-between items-center mt-4 w-full absolute bottom-0 left-0 p-6">
                {totalRecords > 0 && (
                    <div className="text-gray-600">
                        Total Records: {totalRecords}
                    </div>
                )}
                <button
                    onClick={handleExportData}
                    disabled={!filteredData}
                    className={`px-4 py-2 rounded-lg ${
                        filteredData
                            ? 'bg-blue-500 text-white hover:bg-blue-600'
                            : 'bg-gray-400 text-white cursor-not-allowed'
                    }`}
                >
                    Export
                </button>
            </div>

            <ErrorModal 
                isOpen={isModalOpen} 
                onClose={closeModal} 
                message={modalMessage} 
                title={modalTitle} 
            />
        </motion.div>
    );
};

export default FilterPage;
