import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUploadCsvMutation,useTriggerGeocodeUpdateMutation } from '../features/api/apiSlice';
import CsvImport from '../components/CsvImport';
import ErrorModal from '../components/ErrorModal';
import { useSelector } from 'react-redux';

const ImportData = () => {
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.auth); // Get user details from Redux
    const [uploadCsv, { isLoading: isUploading, isSuccess, error: uploadError }] = useUploadCsvMutation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [progress, setProgress] = useState(0); // Progress bar value

    // Redirect non-admin users
    useEffect(() => {
        if (!currentUser?.permissions?.includes('admin')) {
            navigate('/'); // Redirect non-admin users to the home/login page
        }
    }, [currentUser, navigate]);

    // Handle progress bar
    useEffect(() => {
        let interval;
        if (isUploading) {
            setProgress(0);
            interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) return 100;
                    return prev + 1.67; // Increment by 1.67 to complete in ~60 seconds
                });
            }, 1000); // Update every second
        } else {
            setProgress(100); // Set to complete when upload finishes
        }

        return () => clearInterval(interval); // Clear interval on unmount or upload completion
    }, [isUploading]);

    // Handle file selection
    const handleFileSelect = (file) => {
        setSelectedFile(file);
    };

    // Handle save action
    const handleSave = async () => {
        if (!selectedFile) {
            setModalMessage('Please select a CSV file to upload.');
            setIsModalOpen(true);
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await uploadCsv(formData).unwrap(); // Capture API response
            setModalMessage(`New Records Imported: ${response.contacts_imported}`);
            setModalTitle('Success');
            setIsModalOpen(true);
            setSelectedFile(null);
        } catch (err) {
            setModalMessage('Failed to upload CSV file. Please try again.');
            setIsModalOpen(true);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setModalMessage('');
        setModalTitle('');
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-4">Import Data</h1>
            <CsvImport onFileSelected={handleFileSelect} />
            <button
                className={`bg-blue-500 text-white px-4 py-2 rounded mt-4 ${
                    isUploading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                onClick={handleSave}
                disabled={isUploading}
            >
                {isUploading ? 'Uploading...' : 'Save Imported Data'}
            </button>
            {isUploading && (
                <div className="w-full bg-gray-200 rounded-full h-4 mt-4">
                    <div
                        className="bg-blue-500 h-4 rounded-full"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
            )}
            {uploadError && <p className="mt-4 text-red-600">Error uploading file. Please try again.</p>}

            <ErrorModal title={modalTitle} isOpen={isModalOpen} onClose={closeModal} message={modalMessage} />
        </div>
    );
};

export default ImportData;
