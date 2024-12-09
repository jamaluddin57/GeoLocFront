import React from 'react';
import { motion } from 'framer-motion';

const UserModal = ({ isOpen, onClose, formData, setFormData, onSubmit, selectedUser }) => {
    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePermissionsChange = (e) => {
        const { value, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            permissions: checked
                ? [...prev.permissions, value]
                : prev.permissions.filter((perm) => perm !== value),
        }));
    };

    const permissionsMapping = {
        admin: 'Admin',
        import: 'Import',
        export: 'Export',
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <motion.div
                className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                <h2 className="text-2xl font-bold mb-4 text-center">
                    {selectedUser ? 'Edit User' : 'Register User'}
                </h2>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        onSubmit();
                    }}
                >
                    <div className="mb-4">
                        <label htmlFor="username" className="block font-medium">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            required
                            disabled={!!selectedUser}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block font-medium">Password</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            required={!selectedUser}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="firstName" className="block font-medium">First Name</label>
                        <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="lastName" className="block font-medium">Last Name</label>
                        <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className="w-full p-2 border rounded"
                            required
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block font-medium">Permissions</label>
                        {Object.entries(permissionsMapping).map(([key, label]) => (
                            <div key={key} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={key}
                                    value={key}
                                    checked={formData.permissions.includes(key)}
                                    onChange={handlePermissionsChange}
                                />
                                <label htmlFor={key} className="ml-2">{label}</label>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between items-center">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            {selectedUser ? 'Update User' : 'Register User'}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default UserModal;
