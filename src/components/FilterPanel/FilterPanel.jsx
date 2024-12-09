import React, { useState } from 'react';

const FilterPanel = ({ onFilterSubmit, geoEnabled }) => {
    const [zipCode, setZipCode] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        const criteria = {
            zip_code: zipCode,
            city,
            state,
            phone_number: phoneNumber,
        };
        onFilterSubmit(criteria);
    };

    return (
        <form onSubmit={handleSubmit} className="w-full max-w-lg bg-white p-4 rounded-lg shadow-lg mb-6">
            <h2 className="text-xl font-semibold mb-4">Filter Criteria</h2>
            <div className="mb-4">
                <label className="block font-medium mb-2">ZIP Code</label>
                <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="Enter ZIP code"
                />
            </div>
            <div className="mb-4">
                <label className="block font-medium mb-2">City</label>
                <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="Enter city"
                />
            </div>
            <div className="mb-4">
                <label className="block font-medium mb-2">State</label>
                <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="Enter state"
                />
            </div>
            <div className="mb-4">
                <label className="block font-medium mb-2">Phone Number</label>
                <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full p-2 border rounded"
                    placeholder="Enter phone number"
                />
            </div>
            <div className="mb-4">
                <label className="block font-medium mb-2">Geographical Filter</label>
                <p className={`text-sm ${geoEnabled ? 'text-green-600' : 'text-red-600'}`}>
                    {geoEnabled ? 'Shape drawn on the map' : 'No shape drawn yet'}
                </p>
            </div>
            <button
                type="submit"
                className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
                Apply Filter
            </button>
        </form>
    );
};

export default FilterPanel;
