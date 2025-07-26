// src/components/Notifications.jsx
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io("http://localhost:8000", { withCredentials: true });

const Notifications = ({ companyId }) => {
    const [notifications, setNotifications] = useState([]);
    const [showPanel, setShowPanel] = useState(false);

    useEffect(() => {
        if (companyId) {
            // Join company's notification room
            socket.emit("registerCompany", companyId);
        }

        // Listen for new notifications
        socket.on("newApplication", (data) => {
            setNotifications(prev => [data, ...prev]);
        });

        // Cleanup on unmount
        return () => socket.off("newApplication");
    }, [companyId]);

    return (
        <div className="relative">
            <button
                onClick={() => setShowPanel(!showPanel)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
            >
                Notifications {notifications.length > 0 && <span className="ml-2 bg-red-500 px-2 py-1 rounded-full text-xs">{notifications.length}</span>}
            </button>

            {showPanel && (
                <div className="absolute right-0 mt-2 w-80 bg-white border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                        <p className="p-4 text-gray-500">No notifications yet.</p>
                    ) : (
                        notifications.map((notif, index) => (
                            <div key={index} className="p-4 border-b hover:bg-gray-50 transition">
                                <p className="text-gray-800">{notif.message}</p>
                                <p className="text-sm text-gray-500 mt-1">Job: {notif.jobTitle}</p>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
};

export default Notifications;
