import React from "react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const data = [
    { year: "2020", rate: 25 },
    { year: "2021", rate: 26.4 },
    { year: "2022", rate: 24.4 },
    { year: "2023", rate: 30.7 },
    { year: "2024", rate: 28.8 },
];

const UnemploymentChart = () => {
    return (
        <div className="w-full h-96 md:w-[90%] mx-auto">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                    <XAxis dataKey="year" stroke="#e5e7eb" />
                    <YAxis domain={[20, 35]} stroke="#e5e7eb" unit="%" />
                    <Tooltip formatter={(value) => `${value}%`} />
                    <Line type="monotone" dataKey="rate" stroke="#10b981" strokeWidth={3} dot={{ fill: "#34d399", r: 5 }} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default UnemploymentChart;
