import React from 'react';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
import JobInsightsWriter from './JobInsightsWriter';
import { toast } from 'react-hot-toast'; // Import toast for notifications

const COLORS = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
    '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16',
    '#f97316', '#6366f1', '#14b8a6', '#f472b6',
    '#a855f7', '#22d3ee', '#facc15', '#fb7185'
];

const colors = {
    bg: "#0f1214",
    card: "#161a1d",
    cardHover: "#1a1f24",
    grid: "#2c343c",
    sidebar: "#1c1f23",
    primary: "#3b82f6",
    secondary: "#10b981",
    accent: "#f59e0b",
    purple: "#8b5cf6",
    pink: "#ec4899",
    cyan: "#06b6d4",
    chartFill: "#3b82f655",
    text: "#ffffff",
    textMuted: "#9ca3af",
    border: "#374151"
};

const ChartsComp = ({ data = {}, fetchData }) => {
    const {
        accumulatedCounts = {},
        salaryByTitle = {},
        locationCounts = {},
        skillDemand = {},
        contractTypes = {},
        experienceLevels = {},
        remoteJobs = { remote: 0, onsite: 0, hybrid: 0 },
        topEmployers = [],
        jobPostingTrends = [],
        allTitles = []
    } = data;

    const [activeTab, setActiveTab] = React.useState('market');
    const [isLoading, setIsLoading] = React.useState(false);

    const handleFetchData = async () => {
        if (!fetchData) {
            console.log("fetchData not provided");

            return;
        }
        console.log("fetchData function:", fetchData);

        setIsLoading(true);
        try {
            console.log("Fetching...");
            await fetchData();
            alert("Market data refreshed successfully!");
        } catch (error) {
            alert("Failed to fetch market data.");
            console.error('Fetch error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const createBins = (data, binSize = 15000) => {
        if (!data || data.length === 0) return { labels: [], counts: [] };

        const min = Math.min(...data);
        const max = Math.max(...data);
        const binsCount = Math.ceil((max - min) / binSize);
        const counts = Array(binsCount).fill(0);
        const labels = [];

        for (let i = 0; i < binsCount; i++) {
            const start = min + i * binSize;
            const end = start + binSize;
            labels.push(`$${Math.round(start / 1000)}k-$${Math.round(end / 1000)}k`);
        }

        data.forEach((val) => {
            const idx = Math.min(Math.floor((val - min) / binSize), binsCount - 1);
            counts[idx]++;
        });

        return { labels, counts };
    };

    // Enhanced calculations
    const avgSalaryByTitle = Object.entries(salaryByTitle).map(([title, salaries]) => {
        const avg = salaries.reduce((a, b) => a + b, 0) / salaries.length;
        return { title, avgSalary: avg };
    });

    avgSalaryByTitle.sort((a, b) => b.avgSalary - a.avgSalary);
    const salaryHeatmapLabels = avgSalaryByTitle.map((d) => d.title);
    const salaryHeatmapValues = avgSalaryByTitle.map((d) => d.avgSalary);

    // Get all salaries for distribution
    const allSalaries = Object.values(salaryByTitle).flat();
    const { labels: salaryBins, counts: salaryBinCounts } = createBins(allSalaries, 15000);
    const salaryDistributionData = salaryBins.map((label, index) => ({
        name: label,
        value: salaryBinCounts[index]
    }));

    // Prepare market data
    const marketData = Object.entries(accumulatedCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 12)
        .map(([name, value]) => ({ name, value }));

    // Prepare enhanced chart data
    const locationData = Object.entries(locationCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 12)
        .map(([name, value]) => ({ name, value }));

    const skillData = Object.entries(skillDemand)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([skill, count]) => ({ skill, count }));

    const contractData = Object.entries(contractTypes)
        .map(([type, count]) => ({ name: type, value: count }));

    const experienceData = Object.entries(experienceLevels)
        .map(([level, count]) => ({ level, count }));

    const remoteData = [
        { name: 'Remote', value: remoteJobs.remote || 0, fill: colors.secondary },
        { name: 'Hybrid', value: remoteJobs.hybrid || 0, fill: colors.accent },
        { name: 'On-site', value: remoteJobs.onsite || 0, fill: colors.primary }
    ];

    // Stats cards data
    const statsData = [
        {
            title: 'Total Positions Analyzed',
            value: allTitles.length.toLocaleString(),
            icon: '📊',
            color: colors.primary,
            gradient: 'from-blue-500 to-blue-700'
        },
        {
            title: 'Global Markets',
            value: Object.keys(locationCounts).length,
            icon: '🌍',
            color: colors.secondary,
            gradient: 'from-green-500 to-green-700'
        },
        {
            title: 'Average Salary',
            value: allSalaries.length > 0 ?
                `$${Math.round(allSalaries.reduce((a, b) => a + b, 0) / allSalaries.length / 1000)}k` :
                'N/A',
            icon: '💰',
            color: colors.accent,
            gradient: 'from-yellow-500 to-yellow-700'
        },
        {
            title: 'Top Skills Identified',
            value: Object.keys(skillDemand).length,
            icon: '🎯',
            color: colors.purple,
            gradient: 'from-purple-500 to-purple-700'
        },
        {
            title: 'Remote Opportunities',
            value: `${Math.round((remoteJobs.remote / (remoteJobs.remote + remoteJobs.hybrid + remoteJobs.onsite)) * 100) || 0}%`,
            icon: '🏠',
            color: colors.pink,
            gradient: 'from-pink-500 to-pink-700'
        },
        {
            title: 'Active Employers',
            value: topEmployers.length,
            icon: '🏢',
            color: colors.cyan,
            gradient: 'from-cyan-500 to-cyan-700'
        }
    ];

    return (
        <div
            className="min-h-screen text-white relative overflow-hidden"
            style={{ backgroundColor: colors.bg }}
        >
            {/* Data Refresh Button */}
            <div className="fixed top-4 right-4 z-50">
                <button
                    onClick={handleFetchData}
                    disabled={isLoading}
                    className={`px-4 py-2 rounded-full font-bold flex items-center gap-2 transition-all duration-300 ${isLoading
                        ? 'bg-gray-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg'
                        }`}
                >
                    {isLoading ? (
                        <>
                            <svg
                                className="animate-spin h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Loading...
                        </>
                    ) : (
                        <>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            Refresh Data
                        </>
                    )}
                </button>
            </div>

            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 25% 25%, ${colors.primary}40 0%, transparent 50%), 
                           radial-gradient(circle at 75% 75%, ${colors.secondary}40 0%, transparent 50%)`
                }}></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-12">
                {/* Hero Header Section */}
                <div className="text-center mb-16">
                    <div
                        className="relative p-8 sm:p-12 rounded-3xl shadow-2xl border transition-all duration-500 hover:shadow-3xl group overflow-hidden"
                        style={{
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                            background: `linear-gradient(135deg, ${colors.card} 0%, ${colors.cardHover} 100%)`
                        }}
                    >
                        <div className="absolute top-0 left-0 w-full h-full opacity-10">
                            <div className="absolute top-4 left-4 w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-600 animate-pulse"></div>
                            <div className="absolute bottom-4 right-4 w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-blue-600 animate-pulse delay-1000"></div>
                        </div>

                        <div className="relative z-10">
                            <div className="mb-8">
                                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 bg-clip-text text-transparent leading-tight">
                                    Advanced Job Market Intelligence
                                </h1>
                                <p className="text-xl sm:text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed font-light">
                                    Comprehensive analytics platform with enhanced skill tracking, employer insights,
                                    and predictive market intelligence across global employment landscapes
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Stats Dashboard */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {statsData.map((stat, index) => (
                        <div
                            key={index}
                            className="group relative overflow-hidden"
                        >
                            <div
                                className={`
                  relative p-6 rounded-2xl shadow-xl border transition-all duration-500 
                  hover:scale-105 hover:shadow-2xl transform cursor-pointer
                  bg-gradient-to-br ${stat.gradient}
                `}
                                style={{ borderColor: colors.border }}
                            >
                                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
                                <div className="relative z-10">
                                    <div className="flex items-center justify-between mb-4">
                                        <div
                                            className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-2xl sm:text-3xl font-bold shadow-lg"
                                            style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                                        >
                                            {stat.icon}
                                        </div>
                                        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                            <div className="w-2 h-2 rounded-full bg-white animate-pulse"></div>
                                        </div>
                                    </div>
                                    <h3 className="text-xs sm:text-sm font-semibold text-white/80 mb-2 uppercase tracking-wider">{stat.title}</h3>
                                    <p className="text-2xl sm:text-3xl font-black text-white mb-2">{stat.value}</p>
                                    <div className="w-full h-1 bg-white/20 rounded-full overflow-hidden">
                                        <div className="h-full bg-white/60 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Analytics Tabs */}
                <div className="flex flex-wrap justify-center gap-4 mb-8">
                    {['market', 'salary', 'skills', 'global', 'experience', 'employers'].map((tab) => (
                        <button
                            key={tab}
                            className={`px-6 py-3 rounded-full font-bold transition-all duration-300 ${activeTab === tab
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg'
                                : 'bg-gray-800 hover:bg-gray-700'
                                }`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Market Demand Analysis */}
                {(activeTab === 'market' || activeTab === 'all') && (
                    <div className="mb-16">
                        <div
                            className="p-6 sm:p-10 rounded-3xl shadow-2xl border relative overflow-hidden"
                            style={{ backgroundColor: colors.card, borderColor: colors.border }}
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full -translate-y-32 translate-x-32"></div>

                            <div className="relative z-10">
                                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-8 sm:mb-10">
                                    <div
                                        className="w-16 h-16 rounded-3xl flex items-center justify-center text-3xl font-bold shadow-xl"
                                        style={{
                                            background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent}dd)`,
                                            boxShadow: `0 10px 30px ${colors.accent}40`
                                        }}
                                    >
                                        📈
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <h2 className="text-2xl sm:text-4xl font-black text-white mb-2 sm:mb-3">Market Demand Intelligence</h2>
                                        <p className="text-lg sm:text-xl text-gray-300 font-light">Top-tier opportunities by volume</p>
                                    </div>
                                </div>

                                {marketData.length > 0 ? (
                                    <div
                                        className="rounded-3xl p-4 sm:p-8 relative overflow-hidden"
                                        style={{
                                            background: `linear-gradient(135deg, ${colors.sidebar}80, ${colors.cardHover}60)`,
                                            backdropFilter: 'blur(10px)'
                                        }}
                                    >
                                        <ResponsiveContainer width="100%" height={400}>
                                            <BarChart data={marketData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                                                <XAxis
                                                    dataKey="name"
                                                    angle={-45}
                                                    textAnchor="end"
                                                    height={70}
                                                    tick={{ fill: colors.textMuted, fontSize: 12 }}
                                                />
                                                <YAxis
                                                    tick={{ fill: colors.textMuted, fontSize: 12 }}
                                                    label={{
                                                        value: 'Available Positions',
                                                        angle: -90,
                                                        position: 'insideLeft',
                                                        fill: colors.textMuted,
                                                        style: { fontSize: 14 }
                                                    }}
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: colors.card,
                                                        borderColor: colors.border,
                                                        borderRadius: '12px',
                                                        color: colors.text
                                                    }}
                                                    formatter={(value) => [`${value} positions`, 'Count']}
                                                />
                                                <Bar
                                                    dataKey="value"
                                                    name="Available Positions"
                                                    fill={colors.primary}
                                                    radius={[4, 4, 0, 0]}
                                                >
                                                    {marketData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div
                                        className="h-[400px] flex items-center justify-center rounded-3xl border-2 border-dashed"
                                        style={{
                                            borderColor: colors.grid,
                                            background: `linear-gradient(135deg, ${colors.sidebar}40, ${colors.cardHover}20)`
                                        }}
                                    >
                                        <div className="text-center">
                                            <div className="text-8xl mb-6 opacity-40">📈</div>
                                            <p className="text-gray-400 text-xl font-medium">
                                                Market demand insights will appear here
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Compensation Intelligence */}
                {(activeTab === 'salary' || activeTab === 'all') && (
                    <div className="mb-16">
                        <div
                            className="p-6 sm:p-10 rounded-3xl shadow-2xl border relative overflow-hidden"
                            style={{ backgroundColor: colors.card, borderColor: colors.border }}
                        >
                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full -translate-y-32 translate-x-32"></div>

                            <div className="relative z-10">
                                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-8 sm:mb-10">
                                    <div
                                        className="w-16 h-16 rounded-3xl flex items-center justify-center text-3xl font-bold shadow-xl"
                                        style={{
                                            background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent}dd)`,
                                            boxShadow: `0 10px 30px ${colors.accent}40`
                                        }}
                                    >
                                        💰
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <h2 className="text-2xl sm:text-4xl font-black text-white mb-2 sm:mb-3">Advanced Compensation Intelligence</h2>
                                        <p className="text-lg sm:text-xl text-gray-300 font-light">Executive-level salary benchmarking with predictive analytics</p>
                                    </div>
                                </div>

                                {salaryHeatmapLabels.length > 0 ? (
                                    <div
                                        className="rounded-3xl p-4 sm:p-8 relative overflow-hidden"
                                        style={{
                                            background: `linear-gradient(135deg, ${colors.sidebar}80, ${colors.cardHover}60)`,
                                            backdropFilter: 'blur(10px)'
                                        }}
                                    >
                                        <ResponsiveContainer width="100%" height={400}>
                                            <LineChart
                                                data={salaryHeatmapLabels.map((label, index) => ({
                                                    title: label,
                                                    salary: salaryHeatmapValues[index]
                                                }))}
                                            >
                                                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                                                <XAxis
                                                    dataKey="title"
                                                    angle={-45}
                                                    textAnchor="end"
                                                    height={70}
                                                    tick={{ fill: colors.textMuted, fontSize: 12 }}
                                                />
                                                <YAxis
                                                    tick={{ fill: colors.textMuted, fontSize: 12 }}
                                                    label={{
                                                        value: 'Average Salary (USD)',
                                                        angle: -90,
                                                        position: 'insideLeft',
                                                        fill: colors.textMuted,
                                                        style: { fontSize: 14 }
                                                    }}
                                                    tickFormatter={(value) => `$${Math.round(value / 1000)}k`}
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: colors.card,
                                                        borderColor: colors.border,
                                                        borderRadius: '12px',
                                                        color: colors.text
                                                    }}
                                                    formatter={(value) => [`$${value.toLocaleString()}`, 'Salary']}
                                                    labelFormatter={(label) => label}
                                                />
                                                <Line
                                                    type="monotone"
                                                    dataKey="salary"
                                                    name="Average Salary"
                                                    stroke={colors.accent}
                                                    strokeWidth={3}
                                                    dot={{ r: 6, fill: colors.accent }}
                                                    activeDot={{ r: 8, fill: colors.text }}
                                                />
                                            </LineChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div
                                        className="h-[400px] flex items-center justify-center rounded-3xl border-2 border-dashed"
                                        style={{
                                            borderColor: colors.grid,
                                            background: `linear-gradient(135deg, ${colors.sidebar}40, ${colors.cardHover}20)`
                                        }}
                                    >
                                        <div className="text-center">
                                            <div className="text-8xl mb-6 opacity-40">💰</div>
                                            <p className="text-gray-400 text-xl font-medium">
                                                Compensation insights will appear here
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Skills Demand Analysis */}
                {(activeTab === 'skills' || activeTab === 'all') && (
                    <div className="mb-16">
                        <div
                            className="p-6 sm:p-10 rounded-3xl shadow-2xl border relative overflow-hidden group"
                            style={{ backgroundColor: colors.card, borderColor: colors.border }}
                        >
                            <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full -translate-y-24 -translate-x-24 group-hover:scale-110 transition-transform duration-700"></div>

                            <div className="relative z-10">
                                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-8 sm:mb-10">
                                    <div
                                        className="w-16 h-16 rounded-3xl flex items-center justify-center text-3xl font-bold shadow-xl"
                                        style={{
                                            background: `linear-gradient(135deg, ${colors.purple}, ${colors.purple}dd)`,
                                            boxShadow: `0 10px 30px ${colors.purple}40`
                                        }}
                                    >
                                        🎯
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <h2 className="text-2xl sm:text-4xl font-black text-white mb-2 sm:mb-3">Skills Demand Intelligence</h2>
                                        <p className="text-lg sm:text-xl text-gray-300 font-light">Most sought-after technical competencies</p>
                                    </div>
                                </div>

                                {skillData.length > 0 ? (
                                    <div
                                        className="rounded-3xl p-4 sm:p-8 relative overflow-hidden"
                                        style={{
                                            background: `linear-gradient(135deg, ${colors.sidebar}80, ${colors.cardHover}60)`,
                                            backdropFilter: 'blur(10px)'
                                        }}
                                    >
                                        <ResponsiveContainer width="100%" height={400}>
                                            <BarChart data={skillData}>
                                                <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} />
                                                <XAxis
                                                    dataKey="skill"
                                                    angle={-45}
                                                    textAnchor="end"
                                                    height={70}
                                                    tick={{ fill: colors.textMuted, fontSize: 12 }}
                                                />
                                                <YAxis
                                                    tick={{ fill: colors.textMuted, fontSize: 12 }}
                                                    label={{
                                                        value: 'Demand Count',
                                                        angle: -90,
                                                        position: 'insideLeft',
                                                        fill: colors.textMuted,
                                                        style: { fontSize: 14 }
                                                    }}
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: colors.card,
                                                        borderColor: colors.border,
                                                        borderRadius: '12px',
                                                        color: colors.text
                                                    }}
                                                    formatter={(value) => [`${value} positions`, 'Demand']}
                                                />
                                                <Bar
                                                    dataKey="count"
                                                    name="Skill Demand"
                                                    fill={colors.purple}
                                                    radius={[4, 4, 0, 0]}
                                                >
                                                    {skillData.map((entry, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Bar>
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div
                                        className="h-[400px] flex items-center justify-center rounded-3xl border-2 border-dashed"
                                        style={{
                                            borderColor: colors.grid,
                                            background: `linear-gradient(135deg, ${colors.sidebar}40, ${colors.cardHover}20)`
                                        }}
                                    >
                                        <div className="text-center">
                                            <div className="text-8xl mb-6 opacity-40">🎯</div>
                                            <p className="text-gray-400 text-xl font-medium">
                                                Skills intelligence will appear here
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Global Distribution Analysis */}
                {(activeTab === 'global' || activeTab === 'all') && (
                    <div className="mb-16">
                        <div
                            className="p-6 sm:p-10 rounded-3xl shadow-2xl border relative overflow-hidden group"
                            style={{ backgroundColor: colors.card, borderColor: colors.border }}
                        >
                            <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-tl from-green-500/10 to-transparent rounded-full translate-y-24 translate-x-24 group-hover:scale-110 transition-transform duration-700"></div>

                            <div className="relative z-10">
                                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-8 sm:mb-10">
                                    <div
                                        className="w-16 h-16 rounded-3xl flex items-center justify-center text-3xl font-bold shadow-xl"
                                        style={{
                                            background: `linear-gradient(135deg, ${colors.secondary}, ${colors.secondary}dd)`,
                                            boxShadow: `0 10px 30px ${colors.secondary}40`
                                        }}
                                    >
                                        🌍
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <h2 className="text-2xl sm:text-4xl font-black text-white mb-2 sm:mb-3">Global Market Distribution</h2>
                                        <p className="text-lg sm:text-xl text-gray-300 font-light">Worldwide opportunity mapping</p>
                                    </div>
                                </div>

                                {locationData.length > 0 ? (
                                    <div
                                        className="rounded-3xl p-4 sm:p-8 relative overflow-hidden"
                                        style={{
                                            background: `linear-gradient(135deg, ${colors.sidebar}80, ${colors.cardHover}60)`,
                                            backdropFilter: 'blur(10px)'
                                        }}
                                    >
                                        <ResponsiveContainer width="100%" height={500}>
                                            <PieChart>
                                                <Pie
                                                    data={locationData}
                                                    dataKey="value"
                                                    nameKey="name"
                                                    cx="50%"
                                                    cy="50%"
                                                    outerRadius={150}
                                                    innerRadius={70}
                                                    paddingAngle={4}
                                                    label={({ name, percent }) =>
                                                        `${name}: ${(percent * 100).toFixed(0)}%`
                                                    }
                                                    labelLine={false}
                                                    labelStyle={{
                                                        fontSize: 12,
                                                        fontWeight: 600,
                                                        fill: colors.text,
                                                        textShadow: '0 1px 2px rgba(0,0,0,0.5)'
                                                    }}
                                                >
                                                    {locationData.map((entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={COLORS[index % COLORS.length]}
                                                            stroke={colors.card}
                                                            strokeWidth={3}
                                                        />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    formatter={(value, name) => [`${value} opportunities`, name]}
                                                    contentStyle={{
                                                        backgroundColor: colors.card,
                                                        border: `2px solid ${colors.border}`,
                                                        borderRadius: '16px',
                                                        color: colors.text,
                                                        fontWeight: 700,
                                                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
                                                        fontSize: '14px'
                                                    }}
                                                    labelStyle={{
                                                        fontWeight: 800,
                                                        color: colors.primary,
                                                        fontSize: 16
                                                    }}
                                                />
                                                <Legend
                                                    layout="vertical"
                                                    verticalAlign="middle"
                                                    align="right"
                                                    wrapperStyle={{
                                                        paddingLeft: '20px',
                                                        color: colors.textMuted
                                                    }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div
                                        className="h-[500px] flex items-center justify-center rounded-3xl border-2 border-dashed"
                                        style={{
                                            borderColor: colors.grid,
                                            background: `linear-gradient(135deg, ${colors.sidebar}40, ${colors.cardHover}20)`
                                        }}
                                    >
                                        <div className="text-center">
                                            <div className="text-8xl mb-6 opacity-40">🌍</div>
                                            <p className="text-gray-400 text-xl font-medium">
                                                Global insights will appear here
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Experience Level Analysis */}
                {(activeTab === 'experience' || activeTab === 'all') && (
                    <div className="mb-16">
                        <div
                            className="p-6 sm:p-10 rounded-3xl shadow-2xl border relative overflow-hidden group"
                            style={{ backgroundColor: colors.card, borderColor: colors.border }}
                        >
                            <div className="absolute top-0 left-0 w-48 h-48 bg-gradient-to-br from-cyan-500/10 to-transparent rounded-full -translate-y-24 -translate-x-24 group-hover:scale-110 transition-transform duration-700"></div>

                            <div className="relative z-10">
                                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-8 sm:mb-10">
                                    <div
                                        className="w-16 h-16 rounded-3xl flex items-center justify-center text-3xl font-bold shadow-xl"
                                        style={{
                                            background: `linear-gradient(135deg, ${colors.cyan}, ${colors.cyan}dd)`,
                                            boxShadow: `0 10px 30px ${colors.cyan}40`
                                        }}
                                    >
                                        🎓
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <h2 className="text-2xl sm:text-4xl font-black text-white mb-2 sm:mb-3">Experience Level Analysis</h2>
                                        <p className="text-lg sm:text-xl text-gray-300 font-light">Career progression opportunities</p>
                                    </div>
                                </div>

                                {experienceData.length > 0 ? (
                                    <div
                                        className="rounded-3xl p-4 sm:p-8 relative overflow-hidden"
                                        style={{
                                            background: `linear-gradient(135deg, ${colors.sidebar}80, ${colors.cardHover}60)`,
                                            backdropFilter: 'blur(10px)'
                                        }}
                                    >
                                        <ResponsiveContainer width="100%" height={400}>
                                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={experienceData}>
                                                <PolarGrid stroke={colors.grid} />
                                                <PolarAngleAxis
                                                    dataKey="level"
                                                    tick={{ fill: colors.textMuted, fontSize: 12 }}
                                                />
                                                <PolarRadiusAxis
                                                    angle={30}
                                                    domain={[0, 100]}
                                                    tick={{ fill: colors.textMuted, fontSize: 10 }}
                                                />
                                                <Radar
                                                    name="Experience Level"
                                                    dataKey="count"
                                                    stroke={colors.cyan}
                                                    fill={colors.cyan}
                                                    fillOpacity={0.6}
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        backgroundColor: colors.card,
                                                        borderColor: colors.border,
                                                        borderRadius: '12px',
                                                        color: colors.text
                                                    }}
                                                />
                                                <Legend />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    </div>
                                ) : (
                                    <div
                                        className="h-[400px] flex items-center justify-center rounded-3xl border-2 border-dashed"
                                        style={{
                                            borderColor: colors.grid,
                                            background: `linear-gradient(135deg, ${colors.sidebar}40, ${colors.cardHover}20)`
                                        }}
                                    >
                                        <div className="text-center">
                                            <div className="text-8xl mb-6 opacity-40">🎓</div>
                                            <p className="text-gray-400 text-xl font-medium">
                                                Experience analysis will appear here
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Top Employers */}
                {(activeTab === 'employers' || activeTab === 'all') && (
                    <div className="mb-16">
                        <div
                            className="p-6 sm:p-10 rounded-3xl shadow-2xl border relative overflow-hidden group"
                            style={{ backgroundColor: colors.card, borderColor: colors.border }}
                        >
                            <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-tl from-yellow-500/10 to-transparent rounded-full translate-y-24 translate-x-24 group-hover:scale-110 transition-transform duration-700"></div>

                            <div className="relative z-10">
                                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-8 sm:mb-10">
                                    <div
                                        className="w-16 h-16 rounded-3xl flex items-center justify-center text-3xl font-bold shadow-xl"
                                        style={{
                                            background: `linear-gradient(135deg, ${colors.accent}, ${colors.accent}dd)`,
                                            boxShadow: `0 10px 30px ${colors.accent}40`
                                        }}
                                    >
                                        🏢
                                    </div>
                                    <div className="text-center sm:text-left">
                                        <h2 className="text-2xl sm:text-4xl font-black text-white mb-2 sm:mb-3">Top Hiring Companies</h2>
                                        <p className="text-lg sm:text-xl text-gray-300 font-light">Most active employers in the market</p>
                                    </div>
                                </div>

                                {topEmployers.length > 0 ? (
                                    <div
                                        className="rounded-3xl p-4 sm:p-8 relative overflow-hidden"
                                        style={{
                                            background: `linear-gradient(135deg, ${colors.sidebar}80, ${colors.cardHover}60)`,
                                            backdropFilter: 'blur(10px)'
                                        }}
                                    >
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[500px] overflow-y-auto">
                                            {topEmployers.map((employer, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center justify-between p-6 rounded-2xl border transition-all duration-300 hover:scale-105"
                                                    style={{
                                                        backgroundColor: colors.sidebar,
                                                        borderColor: colors.grid
                                                    }}
                                                >
                                                    <div className="flex items-center gap-4">
                                                        <div
                                                            className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold"
                                                            style={{
                                                                background: `linear-gradient(135deg, ${COLORS[index % COLORS.length]}, ${COLORS[index % COLORS.length]}dd)`
                                                            }}
                                                        >
                                                            {index + 1}
                                                        </div>
                                                        <div>
                                                            <h3 className="text-white font-semibold text-lg">{employer.name}</h3>
                                                            <p className="text-gray-400 text-sm">Active Employer</p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <p className="text-2xl font-bold text-white">{employer.count}</p>
                                                        <p className="text-gray-400 text-sm">positions</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className="h-[400px] flex items-center justify-center rounded-3xl border-2 border-dashed"
                                        style={{
                                            borderColor: colors.grid,
                                            background: `linear-gradient(135deg, ${colors.sidebar}40, ${colors.cardHover}20)`
                                        }}
                                    >
                                        <div className="text-center">
                                            <div className="text-8xl mb-6 opacity-40">🏢</div>
                                            <p className="text-gray-400 text-xl font-medium">
                                                Employer insights will appear here
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Executive Intelligence Report */}
                <div
                    className="p-6 sm:p-10 rounded-3xl shadow-2xl border relative overflow-hidden"
                    style={{ backgroundColor: colors.card, borderColor: colors.border }}
                >
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-500/10 to-transparent rounded-full -translate-y-32 translate-x-32"></div>

                    <div className="relative z-10">
                        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 mb-8 sm:mb-10">
                            <div
                                className="w-16 h-16 rounded-3xl flex items-center justify-center text-3xl font-bold shadow-xl"
                                style={{
                                    background: `linear-gradient(135deg, ${colors.primary}, ${colors.primary}dd)`,
                                    boxShadow: `0 10px 30px ${colors.primary}40`
                                }}
                            >
                                📝
                            </div>
                            <div className="text-center sm:text-left">
                                <h2 className="text-2xl sm:text-4xl font-black text-white mb-2 sm:mb-3">Advanced Intelligence Report</h2>
                                <p className="text-lg sm:text-xl text-gray-300 font-light">AI-powered strategic insights with enhanced market analysis</p>
                            </div>
                        </div>

                        <div
                            className="rounded-3xl p-4 sm:p-8"
                            style={{
                                background: `linear-gradient(135deg, ${colors.sidebar}60, ${colors.cardHover}40)`,
                                backdropFilter: 'blur(10px)'
                            }}
                        >
                            <JobInsightsWriter allJobs={allTitles} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChartsComp;