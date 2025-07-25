import React, { useState } from 'react';
import { Box, Button, Typography, Paper } from '@mui/material';
import { BarChart, LineChart } from '@mui/x-charts';
import { axisClasses } from '@mui/x-charts';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

// Define some colors for the pie slices
const COLORS = [
    '#0088FE', '#00C49F', '#FFBB28', '#FF8042',
    '#A569BD', '#CD6155', '#5DADE2', '#52BE80',
    '#F4D03F', '#DC7633',
];

const ADZUNA_APP_ID = '3f42e518';
const ADZUNA_APP_KEY = '0fb84182c81aa9876048cdc04f009064';

const keywordMap = {
    developer: 'Developer',
    engineer: 'Engineer',
    teacher: 'Teacher',
    nurse: 'Nurse',
    doctor: 'Doctor',
    driver: 'Driver',
    designer: 'Designer',
    accountant: 'Accountant',
    'project manager': 'Project Manager',
    sales: 'Sales',
};

// Major countries by continent
const MAJOR_COUNTRIES = [
    // North America
    'United States', 'Canada', 'Mexico',
    // South America
    'Brazil', 'Argentina', 'Colombia', 'Chile',
    // Europe
    'United Kingdom', 'Germany', 'France', 'Italy', 'Spain',
    'Netherlands', 'Sweden', 'Switzerland', 'Russia',
    // Asia
    'China', 'India', 'Japan', 'South Korea', 'Singapore',
    'Indonesia', 'Malaysia', 'Philippines', 'Vietnam',
    // Africa
    'South Africa', 'Nigeria', 'Egypt', 'Kenya',
    // Oceania
    'Australia', 'New Zealand'
];

const ChartsComp = () => {
    const [accumulatedCounts, setAccumulatedCounts] = useState({});
    const [labels, setLabels] = useState([]);
    const [values, setValues] = useState([]);

    const [salaryByTitle, setSalaryByTitle] = useState({});
    const [locationCounts, setLocationCounts] = useState({});
    const [salaryDistribution, setSalaryDistribution] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Function to standardize country names to major countries
    const standardizeToMajorCountry = (countryStr) => {
        if (!countryStr) return null;

        const lowerStr = countryStr.toLowerCase().trim();

        // Check if it matches any major country directly
        for (const country of MAJOR_COUNTRIES) {
            if (lowerStr.includes(country.toLowerCase())) {
                return country;
            }
        }

        // Special cases and abbreviations
        const specialCases = {
            'us': 'United States',
            'usa': 'United States',
            'u.s.': 'United States',
            'america': 'United States',
            'united states': 'United States',
            'uk': 'United Kingdom',
            'u.k.': 'United Kingdom',
            'england': 'United Kingdom',
            'great britain': 'United Kingdom',
            'ca': 'Canada',
            'au': 'Australia',
            'de': 'Germany',
            'fr': 'France',
            'in': 'India',
            'ja': 'Japan',
            'kr': 'South Korea',
            'za': 'South Africa',
            'nz': 'New Zealand'
        };

        for (const [abbr, country] of Object.entries(specialCases)) {
            if (lowerStr.includes(abbr)) {
                return country;
            }
        }

        return null; // Not a major country
    };

    const updateCounts = (titles) => {
        const currentCounts = {};
        titles.forEach((title) => {
            const lower = title.toLowerCase();
            for (const keyword in keywordMap) {
                if (lower.includes(keyword)) {
                    const mapped = keywordMap[keyword];
                    currentCounts[mapped] = (currentCounts[mapped] || 0) + 1;
                    break;
                }
            }
        });

        const merged = { ...accumulatedCounts };
        for (const [title, count] of Object.entries(currentCounts)) {
            merged[title] = (merged[title] || 0) + count;
        }

        const sorted = Object.entries(merged)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);

        setAccumulatedCounts(merged);
        setLabels(sorted.map(([title]) => title));
        setValues(sorted.map(([, count]) => count));
    };

    const updateAdditionalData = (jobs) => {
        const salByTitle = {};
        const countryCounts = {};
        const salaries = [];

        jobs.forEach((job) => {
            const titleRaw = job.job_title || job.title || '';
            let mappedTitle = null;
            const lowerTitle = titleRaw.toLowerCase();
            for (const keyword in keywordMap) {
                if (lowerTitle.includes(keyword)) {
                    mappedTitle = keywordMap[keyword];
                    break;
                }
            }

            const salary =
                job.salary_min ||
                job.salary ||
                job.salary_max ||
                job.estimated_salary ||
                null;
            if (salary && !isNaN(salary)) {
                salaries.push(Number(salary));
                if (mappedTitle) {
                    if (!salByTitle[mappedTitle]) salByTitle[mappedTitle] = [];
                    salByTitle[mappedTitle].push(Number(salary));
                }
            }

            // Enhanced location extraction
            const location =
                job.location?.display_name ||
                job.location_display_name ||
                job.job_location ||
                job.location ||
                job.city ||
                job.area ||
                job.country ||
                null;

            if (location) {
                let locationStr = location;
                if (typeof location === 'object') {
                    locationStr = location.display_name || JSON.stringify(location);
                }

                if (typeof locationStr === 'string' && locationStr.trim() !== '') {
                    const parts = locationStr.split(',').map(p => p.trim());
                    const rawCountry = parts[parts.length - 1];
                    const country = standardizeToMajorCountry(rawCountry);

                    if (country) {
                        countryCounts[country] = (countryCounts[country] || 0) + 1;
                    }
                }
            }
        });

        setSalaryByTitle(salByTitle);
        setLocationCounts(countryCounts);
        setSalaryDistribution(salaries);
    };

    const fetchJobs = async () => {
        setIsLoading(true);
        try {
            const keywords = Object.keys(keywordMap);
            let allTitles = [];
            let allJobs = [];

            for (const keyword of keywords) {
                try {
                    const jRes = await fetch(
                        // https://jsearch.p.rapidapi.com/search?query=${keyword}%20jobs&page=1&num_pages=1&date_posted=all
                        `https://jsearch.p.rapidapi.com/search?query=${keyword}%20jobs&page=1&num_pages=1&date_posted=all`,
                        {
                            method: 'GET',
                            headers: {
                                'X-RapidAPI-Key': 'b4232c55e1msh2fa179ace936293p15516djsn3b98c2ac71c2',
                                'X-RapidAPI-Host': 'jsearch.p.rapidapi.com',
                            },
                        }
                    );
                    if (jRes.ok) {
                        const jData = await jRes.json();
                        const jTitles = jData.data?.map((job) => job.job_title) || [];
                        const jJobs = jData.data || [];
                        allTitles.push(...jTitles);
                        allJobs.push(...jJobs);
                    } else {
                        console.warn(`JSearch API failed for keyword "${keyword}" with status: ${jRes.status}`);
                    }
                } catch (err) {
                    console.warn(`JSearch fetch error for keyword "${keyword}":`, err);
                }

                try {
                    const aRes = await fetch(
                        `https://api.adzuna.com/v1/api/jobs/us/search/1?app_id=${ADZUNA_APP_ID}&app_key=${ADZUNA_APP_KEY}&results_per_page=10&what=${keyword}`
                    );
                    if (aRes.ok) {
                        const aData = await aRes.json();
                        const aTitles = aData.results?.map((job) => job.title) || [];
                        const aJobs = aData.results || [];
                        allTitles.push(...aTitles);
                        allJobs.push(...aJobs);
                    } else {
                        console.warn(`Adzuna API failed for keyword "${keyword}" with status: ${aRes.status}`);
                    }
                } catch (err) {
                    console.warn(`Adzuna fetch error for keyword "${keyword}":`, err);
                }
            }

            updateCounts(allTitles);
            updateAdditionalData(allJobs);
        } catch (err) {
            console.error('Fetch error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const createBins = (data, binSize = 10000) => {
        if (data.length === 0) return { labels: [], counts: [] };
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

    const avgSalaryByTitle = Object.entries(salaryByTitle).map(([title, salaries]) => {
        const avg = salaries.reduce((a, b) => a + b, 0) / salaries.length;
        return { title, avgSalary: avg };
    });
    avgSalaryByTitle.sort((a, b) => b.avgSalary - a.avgSalary);
    const salaryHeatmapLabels = avgSalaryByTitle.map((d) => d.title);
    const salaryHeatmapValues = avgSalaryByTitle.map((d) => d.avgSalary);

    const { labels: salaryBins, counts: salaryBinCounts } = createBins(salaryDistribution, 10000);

    // Prepare pie chart data for locations
    const locationData = Object.entries(locationCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([name, value]) => ({ name, value }));

    return (
        <Box className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-6xl mx-auto">
                <Typography
                    variant="h4"
                    className="text-center mb-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white rounded-xl shadow-lg"
                >
                    📊 Job Market Analysis Dashboard
                </Typography>

                <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 px-4 max-w-screen-xl mx-auto py-6">

                    {/* Top Job Titles Bar Chart */}
                    <Paper className="lg:col-span-3 w-full p-6 bg-white rounded-2xl shadow-lg transition-all hover:shadow-2xl">
                        <Typography variant="h6" className="font-bold text-gray-800 mb-4">
                            Top 10 Job Titles
                        </Typography>
                        {labels.length > 0 ? (
                            <BarChart
                                xAxis={[{
                                    scaleType: 'band',
                                    data: labels,
                                    tickLabelStyle: { fontSize: 12, angle: -25, textAnchor: 'end' },
                                }]}
                                yAxis={[{ label: 'Job Count' }]}
                                series={[{ data: values, label: 'Jobs', color: '#3b82f6' }]}
                                height={300}
                                sx={{
                                    [`& .${axisClasses.left} .MuiChartsAxis-tickLabel`]: { fontSize: 14 },
                                    [`& .${axisClasses.bottom} .MuiChartsAxis-tickLabel`]: { fill: '#4b5563' },
                                }}
                            />
                        ) : (
                            <div className="h-64 flex items-center justify-center">
                                <Typography className="text-gray-500 italic">
                                    {isLoading ? "Loading job titles..." : "Click the button to fetch data"}
                                </Typography>
                            </div>
                        )}
                    </Paper>

                    {/* Global Job Distribution */}
                    <Paper className="lg:col-span-3 w-full p-6 bg-white rounded-2xl shadow-lg transition-all hover:shadow-2xl">
                        <Typography variant="h6" className="font-bold text-gray-800 mb-4 text-center">
                            Global Job Distribution
                        </Typography>
                        {locationData.length > 0 ? (
                            <div className="h-[350px] flex flex-col items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={locationData}
                                            dataKey="value"
                                            nameKey="name"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={2}
                                            label={({ name, percent }) => (percent > 0.05 ? `${name}\n${(percent * 100).toFixed(0)}%` : null)}
                                            labelLine={true}
                                        >
                                            {locationData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            formatter={(value, name, props) => [`${value} jobs`, props.payload.name]}
                                            contentStyle={{
                                                borderRadius: '8px',
                                                border: '1px solid #e5e7eb',
                                                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                                                backgroundColor: 'white',
                                                fontWeight: 600,
                                            }}
                                            labelStyle={{ fontWeight: 600, color: '#3b82f6' }}
                                            itemStyle={{ padding: '4px 0' }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        ) : (
                            <div className="h-64 flex items-center justify-center">
                                <Typography className="text-gray-500 italic">
                                    {isLoading ? "Mapping locations..." : "Location data will appear here"}
                                </Typography>
                            </div>
                        )}
                    </Paper>

                    {/* Salary Distribution */}
                    <Paper className="lg:col-span-3 w-full p-6 bg-white rounded-2xl shadow-lg transition-all hover:shadow-2xl">
                        <Typography variant="h6" className="font-bold text-gray-800 mb-4">
                            Salary Distribution
                        </Typography>
                        {salaryBinCounts.length > 0 ? (
                            <BarChart
                                xAxis={[{
                                    scaleType: 'band',
                                    data: salaryBins,
                                    tickLabelStyle: { fontSize: 12, angle: -30, textAnchor: 'end' },
                                }]}
                                yAxis={[{ label: 'Number of Jobs' }]}
                                series={[{ data: salaryBinCounts, label: 'Count', color: '#8b5cf6' }]}
                                height={300}
                            />
                        ) : (
                            <div className="h-64 flex items-center justify-center">
                                <Typography className="text-gray-500 italic">
                                    {isLoading ? "Analyzing salaries..." : "Salary distribution will appear here"}
                                </Typography>
                            </div>
                        )}
                    </Paper>

                    {/* Average Salary by Job Title - Full width */}
                    <Paper className="lg:col-span-6 w-full p-6 bg-white rounded-2xl shadow-lg transition-all hover:shadow-2xl">
                        <Typography variant="h6" className="font-bold text-gray-800 mb-4">
                            Average Salary by Job Title
                        </Typography>
                        {salaryHeatmapLabels.length > 0 ? (
                            <LineChart
                                xAxis={[{
                                    scaleType: 'band',
                                    data: salaryHeatmapLabels,
                                    tickLabelStyle: {
                                        fontSize: 12,
                                        angle: -25,
                                        textAnchor: 'end',
                                        padding: 10
                                    },
                                }]}
                                yAxis={[{
                                    label: 'Average Salary ($)',
                                    valueFormatter: (value) => `$${Math.round(value).toLocaleString()}`
                                }]}
                                series={[{
                                    data: salaryHeatmapValues,
                                    label: 'Avg Salary',
                                    color: '#f59e0b',
                                }]}
                                height={350}
                                margin={{ top: 20, right: 30, bottom: 80, left: 60 }}
                            />
                        ) : (
                            <div className="h-64 flex items-center justify-center">
                                <Typography className="text-gray-500 italic">
                                    {isLoading ? "Calculating salaries..." : "Salary data will appear here"}
                                </Typography>
                            </div>
                        )}
                    </Paper>
                </div>


                <div className="mt-8 text-center">
                    <Button
                        variant="contained"
                        onClick={fetchJobs}
                        disabled={isLoading}
                        className="py-3 px-8 text-lg font-bold rounded-full shadow-lg transition-all transform hover:scale-105"
                        style={{
                            background: 'linear-gradient(45deg, #3b82f6 30%, #8b5cf6 90%)',
                        }}
                    >
                        {isLoading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Loading Data...
                            </span>
                        ) : (
                            '🔍 Fetch Job Data'
                        )}
                    </Button>
                </div>
            </div>
        </Box>
    );
};

export default ChartsComp;