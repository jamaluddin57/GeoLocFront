import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUploadCsvMutation, useTriggerGeocodeUpdateMutation } from '../features/api/apiSlice';
import CsvImport from '../components/CsvImport';
import ErrorModal from '../components/ErrorModal';
import GeocodeModal from '../components/GeocodeModal'; // Separate modal component
import { useSelector } from 'react-redux';

const ImportData = () => {
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.auth); // Get user details from Redux
    const [uploadCsv, { isLoading: isUploading, error: uploadError }] = useUploadCsvMutation();
    const [triggerGeocodeUpdate] = useTriggerGeocodeUpdateMutation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isGeocodeModalOpen, setIsGeocodeModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [modalTitle, setModalTitle] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [progress, setProgress] = useState(0); // Progress bar value
    const [estimatedTime, setEstimatedTime] = useState(0); // Estimated upload time in seconds

    // Redirect non-admin users
    useEffect(() => {
        if (!currentUser?.permissions?.includes('admin') && !currentUser?.permissions?.includes('import')) {
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
                    return prev + (100 / estimatedTime); // Increment based on estimated time
                });
            }, 1000); // Update every second
        } else {
            setProgress(100); // Set to complete when upload finishes
        }

        return () => clearInterval(interval); // Clear interval on unmount or upload completion
    }, [isUploading, estimatedTime]);

    // Handle file selection
    const handleFileSelect = (file) => {
        setSelectedFile(file);
        const fileSizeInMB = file.size / (1024 * 1024); // Convert file size to MB
        const uploadSpeedInMBps = 1; // Assume an upload speed of 1 MBps for estimation
        const estimatedTimeInSeconds = fileSizeInMB / uploadSpeedInMBps;
        setEstimatedTime(estimatedTimeInSeconds);
    };

    // Handle save action
    const handleSave = async () => {
        if (!selectedFile) {
            setModalMessage('Please select a CSV file to upload.');
            setModalTitle('Error');
            setIsModalOpen(true);
            return;
        }

        const formData = new FormData();
        formData.append('file', selectedFile);

        try {
            const response = await uploadCsv(formData).unwrap(); // Capture API response
            setModalMessage(`New Records Imported: ${response.contacts_imported}\nTotal Records: ${response.total_rows}\nInvalid Rows: ${response.skipped_rows}\nDuplicate Rows (File): ${response.duplicate_file}\nAlready existing: ${response.duplicate_db}`);
            setModalTitle('Success');
            setIsModalOpen(true);
        } catch (err) {
            setModalMessage('Failed to upload CSV file. Please try again.');
            setModalTitle('Error');
            setIsModalOpen(true);
        }
    };

    // Handle geocoding confirmation
    const handleGeocodeConfirm = async () => {
        try {
            await triggerGeocodeUpdate(selectedFile.name); // Trigger geocoding update with filename
            setModalMessage('Geocoding process started successfully.');
            setModalTitle('Geocoding');
        } catch (err) {
            setModalMessage('Failed to start geocoding. Please try again.');
            setModalTitle('Error');
        } finally {
            setIsModalOpen(true);
            setIsGeocodeModalOpen(false);
        }
    };

    // Handle geocoding cancellation
    const handleGeocodeCancel = () => {
        setIsGeocodeModalOpen(false);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        if (modalTitle === 'Success') {
            setIsGeocodeModalOpen(true); // Open geocode modal after success modal is closed
        }
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

            <ErrorModal
                title={modalTitle}
                isOpen={isModalOpen}
                onClose={closeModal}
                message={modalMessage}
            />

            <GeocodeModal
                isOpen={isGeocodeModalOpen}
                onConfirm={handleGeocodeConfirm}
                onCancel={handleGeocodeCancel}
            />
        </div>
    );
};

export default ImportData;
