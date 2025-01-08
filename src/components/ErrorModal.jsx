import React from 'react';
import { motion } from 'framer-motion';

const ErrorModal = ({ isOpen, onClose, message, title }) => {
    if (!isOpen) return null;

    const modalVariants = {
        hidden: { opacity: 0, y: "-50%" },
        visible: { opacity: 1, y: "0%", transition: { type: 'spring', stiffness: 100, damping: 10 } },
    };

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    return (
        <motion.div
    className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    style={{ zIndex: 1000 }}
    initial="hidden"
    animate="visible"
    exit="hidden"
    variants={backdropVariants}
>
            <motion.div
                className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm text-center"
                variants={modalVariants}
            >
                <h2 className="text-lg font-bold text-red-500">{title?title:Error}</h2>
                {/* <p className="text-gray-700 mt-2">{message}</p> */}
                {message.split('\n').map(str => <p className="text-gray-700 mt-2">{str}</p>)}
                <button
                    className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    onClick={onClose}
                >
                    Close
                </button>
            </motion.div>
        </motion.div>
    );
};

export default ErrorModal;
