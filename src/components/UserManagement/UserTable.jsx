import React from 'react';

const UsersTable = ({ users, isLoading, error, onEdit }) => {
    if (isLoading) return <p>Loading users...</p>;
    if (error) return <p>Error loading users.</p>;

    return (
        <table className="w-full border-collapse border rounded">
            <thead>
                <tr className="bg-gray-200">
                    <th className="border p-2">Username</th>
                    <th className="border p-2">First Name</th>
                    <th className="border p-2">Last Name</th>
                    <th className="border p-2">Permissions</th>
                    <th className="border p-2">Actions</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user) => (
                    <tr key={user.user_id}>
                        <td className="border p-2">{user.username}</td>
                        <td className="border p-2">{user.first_name}</td>
                        <td className="border p-2">{user.last_name}</td>
                        <td className="border p-2">
                            {user.permissions.map((perm) => 
                                perm.charAt(0).toUpperCase() + perm.slice(1)
                            ).join(', ')}
                        </td>
                        <td className="border p-2">
                            <button
                                onClick={() => onEdit(user)}
                                className="px-2 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                            >
                                Edit
                            </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default UsersTable;
