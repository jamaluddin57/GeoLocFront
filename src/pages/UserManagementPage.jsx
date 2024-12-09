import React, { useState } from 'react';
import { useGetUsersQuery, useRegisterMutation, useUpdateUserMutation } from '../features/api/apiSlice';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import UsersTable from '../components/UserManagement/UserTable';
import Pagination from '../components/Pagination';
import UserModal from '../components/UserManagement/UserModal';

const UserManagementPage = () => {
    const navigate = useNavigate();
    const currentUser = useSelector((state) => state.auth);
    const [registerUser] = useRegisterMutation();
    const [updateUser] = useUpdateUserMutation();
    const [page, setPage] = useState(1);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        username: '',
        password: '',
        firstName: '',
        lastName: '',
        permissions: [],
    });

    // Fetch users with pagination
    const { data: users, isLoading, error, refetch } = useGetUsersQuery({ skip: (page - 1) * 10, limit: 10 });

    // Redirect non-admins
    if (!currentUser?.permissions?.includes('admin')) {
        navigate('/');
    }

    const openModal = (user = null) => {
        setSelectedUser(user);
        if (user) {
            setFormData({
                username: user.username,
                password: '',
                firstName: user.first_name,
                lastName: user.last_name,
                permissions: user.permissions || [],
            });
        } else {
            setFormData({
                username: '',
                password: '',
                firstName: '',
                lastName: '',
                permissions: [],
            });
        }
        setIsModalOpen(true);
    };

    const handleFormSubmit = async () => {
        try {
            if (selectedUser) {
                await updateUser({ userId: selectedUser.user_id, userData: formData }).unwrap();
                alert('User updated successfully!');
            } else {
                await registerUser({...formData, first_name:formData.firstName, last_name:formData.lastName}).unwrap();
                alert('User registered successfully!');
            }
            refetch();
            setIsModalOpen(false);
        } catch (err) {
            alert('Operation failed. Please try again.');
        }
    };

    return (
        <div className="container mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">User Management</h1>

            {/* Register User Button */}
            <div className="flex justify-center mb-6">
                <button
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600"
                    onClick={() => openModal()}
                >
                    Register User
                </button>
            </div>

            {/* Users Table */}
            <UsersTable
                users={users}
                isLoading={isLoading}
                error={error}
                onEdit={(user) => openModal(user)}
            />

            {/* Pagination */}
            <Pagination page={page} setPage={setPage} />

            {/* User Modal */}
            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                formData={formData}
                setFormData={setFormData}
                onSubmit={handleFormSubmit}
                selectedUser={selectedUser}
            />
        </div>
    );
};

export default UserManagementPage;
