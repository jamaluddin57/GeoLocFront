import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useTriggerGeocodeUpdateMutation, useGetCurrentTasksQuery, useGetGeocodeTaskStatusQuery } from '../features/api/apiSlice';

const GeocodePage = () => {
    const [taskId, setTaskId] = useState('');
    const [triggerGeocode, { isLoading: isTriggering }] = useTriggerGeocodeUpdateMutation();
    const { data: currentTasks, refetch: refetchTasks } = useGetCurrentTasksQuery();
    const { data: taskStatus, refetch: refetchStatus } = useGetGeocodeTaskStatusQuery(taskId, { skip: !taskId });

    const handleTriggerGeocode = async () => {
        try {
            const response = await triggerGeocode().unwrap();
            setTaskId(response.task_id);
            alert('Geocoding process started successfully! Your task ID is saved.');
        } catch (error) {
            alert('Something went wrong while starting the geocoding process. Please try again.');
        }
    };

    const handleCheckStatus = () => {
        if (!taskId) {
            alert('Please enter a valid Task ID to check the status.');
            return;
        }
        refetchStatus();
    };

    return (
        <div className="min-h-screen bg-white py-8 px-4 mt-24">
            <div className="max-w-4xl mx-auto bg-white shadow rounded-lg p-6 space-y-6">
                <h1 className="text-2xl font-bold text-black text-center">Geocode Management</h1>
                <p className="text-black text-center">
                    Use this page to start a geocoding process, check the progress of your tasks, or view all ongoing tasks.
                </p>

                {/* Trigger Geocoding Section
                <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-xl font-semibold text-black">Start a Geocoding Process</h2>
                    <p className="text-black">
                        Click the button below to begin updating geocoding information. This may take some time depending on the data size.
                    </p>
                    <button
                        className="w-full px-4 py-2 bg-black text-white font-semibold rounded hover:bg-gray-800 transition"
                        onClick={handleTriggerGeocode}
                        disabled={isTriggering}
                    >
                        {isTriggering ? 'Starting Geocoding...' : 'Start Geocoding'}
                    </button>
                </motion.div> */}

                {/* Check Task Status Section */}
                <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-xl font-semibold text-black">Check Task Progress</h2>
                    <p className="text-black">
                        Enter your Task ID to check the progress of a specific geocoding task.
                    </p>
                    <input
                        type="text"
                        placeholder="Enter Task ID"
                        className="block w-full border-gray-300 bg-white text-black rounded-lg shadow-sm focus:ring-gray-500 focus:border-gray-500"
                        value={taskId}
                        onChange={(e) => setTaskId(e.target.value)}
                    />
                    <button
                        className="w-full px-4 py-2 bg-black text-white font-semibold rounded hover:bg-gray-800 transition"
                        onClick={handleCheckStatus}
                    >
                        Check Progress
                    </button>
                    {taskStatus && (
                        <div className="mt-4 bg-gray-200 p-4 rounded shadow">
                            <p className="text-black"><strong>Task Status:</strong> {taskStatus.status}</p>
                            {taskStatus.progress && (
                                <p className="text-black">
                                    <strong>Progress:</strong> {taskStatus.progress.current} of {taskStatus.progress.total} (
                                    {taskStatus.progress.percent}%)
                                </p>
                            )}
                            {taskStatus.result && <p className="text-black"><strong>Result:</strong> Task completed successfully!</p>}
                            {taskStatus.error && <p className="text-red-500"><strong>Error:</strong> {taskStatus.error}</p>}
                        </div>
                    )}
                </motion.div>

                {/* Active Tasks Section */}
                <motion.div
                    className="space-y-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-xl font-semibold text-black">View Ongoing Tasks</h2>
                    <p className="text-black">
                        Click the button below to see all ongoing geocoding tasks and their start times.
                    </p>
                    <button
                        className="w-full px-4 py-2 bg-black text-white font-semibold rounded hover:bg-gray-800 transition"
                        onClick={refetchTasks}
                    >
                        Refresh Task List
                    </button>
                    {currentTasks && currentTasks.active_tasks?.length > 0 ? (
                        <ul className="space-y-2 mt-4">
                            {currentTasks.active_tasks.map((task) => (
                                <li
                                    key={task.task_id}
                                    className="flex items-center justify-between bg-gray-200 p-4 rounded shadow"
                                >
                                    <span className="text-black"><strong>Task ID:</strong> {task.task_id}</span>
                                    <span className="text-black"><strong>Start Time:</strong> {new Date(task.start_time).toLocaleString()}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 mt-4">No Active geocoding task</p>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

export default GeocodePage;
