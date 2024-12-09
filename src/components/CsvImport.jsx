import React from 'react';

const CsvImport = ({ onFileSelected }) => {
    const handleFileChange = (e) => {
        if (e.target.files.length > 0) {
            onFileSelected(e.target.files[0]);
        }
    };

    return (
        <div className="mb-4 mt-8">
            <label htmlFor="csvFile" className="block text-sm font-medium text-gray-700 mb-2">
                Upload CSV File
            </label>
            <input
                type="file"
                id="csvFile"
                accept=".csv"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer focus:outline-none"
            />
        </div>
    );
};

export default CsvImport;
