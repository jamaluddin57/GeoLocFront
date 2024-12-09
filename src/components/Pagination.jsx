import React from 'react';

const Pagination = ({ page, setPage }) => (
    <div className="flex justify-between mt-4">
        <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
            disabled={page === 1}
        >
            Previous
        </button>
        <span>Page {page}</span>
        <button
            onClick={() => setPage((prev) => prev + 1)}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
        >
            Next
        </button>
    </div>
);

export default Pagination;
