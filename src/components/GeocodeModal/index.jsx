import React from 'react';

const GeocodeModal = ({ isOpen, onConfirm, onCancel }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-1/3">
                <h2 className="text-xl font-bold mb-4">Start Geocoding?</h2>
                <p className="mb-4">Do you want to start the geocoding process now?</p>
                <div className="flex justify-end">
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded mr-4"
                        onClick={onConfirm}
                    >
                        Yes, Start Geocoding
                    </button>
                    <button
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                        onClick={onCancel}
                    >
                        No, Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default GeocodeModal;
