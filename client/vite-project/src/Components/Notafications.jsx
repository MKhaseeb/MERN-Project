// src/components/Notifications.jsx
import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

const socket = io("http://localhost:8000", { withCredentials: true });

const Notifications = ({ companyId }) => {
    // نقرأ الإشعارات من localStorage أول مرة يتم تحميل المكون
    const [notifications, setNotifications] = useState(() => {
        const saved = localStorage.getItem("companyNotifications");
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        if (companyId) {
            socket.emit("registerCompany", companyId);
        }

        socket.on("newApplication", (data) => {
            console.log("Received notification:", data);
            setNotifications((prev) => {
                const updated = [data, ...prev];
                // نخزن الإشعارات في localStorage بعد كل تحديث
                localStorage.setItem("companyNotifications", JSON.stringify(updated));
                return updated;
            });
        });

        return () => {
            socket.off("newApplication");
        };
    }, [companyId]);

    return (
        <section>
            <h3 className="text-2xl font-bold mb-4 text-white">🔔 Notifications</h3>
            <div className="bg-[#161a1d] border border-gray-700 rounded-lg shadow divide-y divide-gray-700">
                {notifications.map((notif, index) => (
                    <div key={index} className="p-4 hover:bg-[#1c1f23] transition">
                        <p className="text-gray-200">
                            {notif.userName
                                ? `${notif.userName} applied to your job: ${notif.jobTitle}`
                                : notif.message}
                        </p>
                        <p className="text-sm text-gray-400 mt-1">Job: {notif.jobTitle}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Notifications;
