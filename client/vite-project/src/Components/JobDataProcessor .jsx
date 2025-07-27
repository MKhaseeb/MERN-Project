import React, { useEffect, useState } from 'react';
import axios from 'axios';
import JobInsightsViewer from './JobInsightsViewer'; // Child component
import ChartsComp from './ChartsComp';

const JobDataProvider = () => {
    const [processedData, setProcessedData] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_KEY = 'b4232c55e1msh2fa179ace936293p15516djsn3b98c2ac71c2';
    const API_HOST = 'jsearch.p.rapidapi.com';

    const fetchJobs = async () => {
        try {
            const response = await axios.get('https://jsearch.p.rapidapi.com/search', {
                params: {
                    query: 'developer',
                    page: '1',
                    num_pages: '1'
                },
                headers: {
                    'X-RapidAPI-Key': API_KEY,
                    'X-RapidAPI-Host': API_HOST
                }
            });

            const jobs = response.data.data;
            const structured = processJobData(jobs);
            setProcessedData(structured);
        } catch (error) {
            console.error('Fetch error:', error);
        } finally {
            setLoading(false);
        }
    };

    const processJobData = (jobs) => {
        const data = {
            accumulatedCounts: {},
            salaryByTitle: {},
            locationCounts: {},
            skillDemand: {},
            contractTypes: {},
            experienceLevels: {},
            remoteJobs: { remote: 0, onsite: 0, hybrid: 0 },
            topEmployers: {},
            jobPostingTrends: {},
            allTitles: []
        };

        const skillKeywords = ['JavaScript', 'Python', 'PHP', 'SQL', 'AWS', 'Docker', 'Java', 'HTML', 'CSS', 'DevOps', 'C#', 'Cloud', 'MX Records', 'DNS'];

        jobs.forEach(job => {
            const title = job.job_title?.split(' at ')[0]?.trim();
            if (!title) return;
            data.accumulatedCounts[title] = (data.accumulatedCounts[title] || 0) + 1;
            data.allTitles.push(title);

            const salaryMatch = job.job_description?.match(/(\d{2,3})K\+?/i);
            if (salaryMatch) {
                const salary = parseInt(salaryMatch[1]) * 1000;
                data.salaryByTitle[title] = data.salaryByTitle[title] || [];
                data.salaryByTitle[title].push(salary);
            }

            const country = job.job_country || 'Unknown';
            const city = job.job_city || 'Unknown';
            data.locationCounts[country] = (data.locationCounts[country] || 0) + 1;
            data.locationCounts[city] = (data.locationCounts[city] || 0) + 1;

            skillKeywords.forEach(skill => {
                if (job.job_description?.toLowerCase().includes(skill.toLowerCase())) {
                    data.skillDemand[skill] = (data.skillDemand[skill] || 0) + 1;
                }
            });

            const type = job.job_employment_type || 'Unknown';
            data.contractTypes[type] = (data.contractTypes[type] || 0) + 1;

            if (/3[-–]?5\+? years/i.test(job.job_description)) {
                data.experienceLevels['Mid-Level'] = (data.experienceLevels['Mid-Level'] || 0) + 1;
            } else if (/senior/i.test(job.job_description)) {
                data.experienceLevels['Senior'] = (data.experienceLevels['Senior'] || 0) + 1;
            } else if (/entry[- ]?level/i.test(job.job_description)) {
                data.experienceLevels['Entry'] = (data.experienceLevels['Entry'] || 0) + 1;
            }

            if (job.job_is_remote) {
                data.remoteJobs.remote++;
            } else if (/hybrid/i.test(job.job_description)) {
                data.remoteJobs.hybrid++;
            } else {
                data.remoteJobs.onsite++;
            }

            const employer = job.employer_name || 'Unknown';
            data.topEmployers[employer] = (data.topEmployers[employer] || 0) + 1;

            const date = new Date(job.job_posted_at_datetime_utc);
            const key = `${date.getMonth() + 1}/${date.getFullYear()}`;
            data.jobPostingTrends[key] = (data.jobPostingTrends[key] || 0) + 1;
        });

        data.topEmployers = Object.entries(data.topEmployers)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);

        data.jobPostingTrends = Object.entries(data.jobPostingTrends)
            .map(([period, count]) => ({
                period,
                count,
                date: new Date(`${period.split('/')[1]}-${period.split('/')[0]}-15`)
            }))
            .sort((a, b) => a.date - b.date);

        return data;
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    return (
        <div className="p-4">
            <h1 className="text-2xl font-bold mb-4">Job Insights</h1>
            {loading ? (
                <p>Loading...</p>
            ) : processedData ? (
                <ChartsComp data={processedData} fetchData={fetchJobs} />
            ) : (
                <p>No data available.</p>
            )}
        </div>
    );
};

export default JobDataProvider;
