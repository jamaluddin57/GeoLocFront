import React, { useState } from 'react';
import { motion } from 'framer-motion';

const FilterForm = ({ onFilterSubmit, onFormChange, geoEnabled, onClearFilters }) => {
    const [zipCode, setZipCode] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFormChange = () => {
        onFormChange({ zip_code: zipCode, city, state, phone_number: phoneNumber });
    };

    const handleClear = () => {
        setZipCode('');
        setCity('');
        setState('');
        setPhoneNumber('');
        onClearFilters();
    };

    const handleSubmit = async () => {
        setLoading(true);
        await onFilterSubmit();
        setLoading(false);
    };

    return (
        <motion.div
            className="bg-white shadow-md rounded-lg p-6 w-full md:w-1/3"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
        >
            <h2 className="text-2xl font-semibold mb-4 text-center">Filter Criteria</h2>
            <form className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">ZIP Code</label>
                    <input
                        type="text"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        onBlur={handleFormChange}
                        className="w-full p-2 border rounded"
                        placeholder="Enter ZIP code"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">City</label>
                    <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        onBlur={handleFormChange}
                        className="w-full p-2 border rounded"
                        placeholder="Enter city"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">State</label>
                    <input
                        type="text"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        onBlur={handleFormChange}
                        className="w-full p-2 border rounded"
                        placeholder="Enter state"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <input
                        type="text"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        onBlur={handleFormChange}
                        className="w-full p-2 border rounded"
                        placeholder="Enter phone number"
                    />
                </div>
                <div className="mt-4">
                    <label className="block text-sm font-medium mb-2">Geographical Filter</label>
                    <p className={`text-sm ${geoEnabled ? 'text-green-600' : 'text-red-600'}`}>
                        {geoEnabled ? 'Shape drawn on the map' : 'No shape drawn yet'}
                    </p>
                </div>
                <div className="flex space-x-2">
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className={`w-1/2 py-2 rounded-lg text-white flex justify-center items-center ${(!zipCode && !city && !state && !phoneNumber && !geoEnabled) || loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
                        disabled={(!zipCode && !city && !state && !phoneNumber && !geoEnabled) || loading}
                    >
                        {loading ? (
                            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        ) : (
                            'Apply Filter'
                        )}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

export default FilterForm;
