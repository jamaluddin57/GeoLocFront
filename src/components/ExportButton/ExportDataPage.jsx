import React from 'react';
import { saveAs } from 'file-saver';

const ExportDataPage = ({ filteredData }) => {
    const handleDownload = () => {
        const csvContent = [
            ['First Name', 'Last Name', 'Phone Number', 'City', 'State', 'ZIP Code'],
            ...filteredData.map((row) => [
                row.first_name,
                row.last_name,
                row.phone_number,
                row.city,
                row.state,
                row.zip_code,
            ]),
        ]
            .map((e) => e.join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        saveAs(blob, 'filtered_data.csv');
    };

    return (
        <div className="container mx-auto p-6 mt-20">
            <h1 className="text-3xl font-bold mb-4">Export Filtered Data</h1>
            <p className="text-lg mb-4">
                Total Records Found: <span className="font-semibold">{filteredData.length}</span>
            </p>
            <button
                onClick={handleDownload}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
                Download CSV
            </button>
        </div>
    );
};

export default ExportDataPage;
