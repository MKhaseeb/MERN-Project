import React, { useEffect, useState } from 'react';

const JobInsightsWriter = ({ allJobs }) => {
    const [article, setArticle] = useState('');
    const [loading, setLoading] = useState(false);

    const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;  // For Vite

    useEffect(() => {
        if (!allJobs || allJobs.length === 0) return;

        const fetchOpenAIResponse = async () => {
            setLoading(true);
            try {
                const response = await fetch('https://api.openai.com/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer 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`
                        ,
                    },
                    body: JSON.stringify({
                        model: "gpt-4",
                        messages: [
                            {
                                role: "system",
                                content: "You are a career advisor and job market analyst. Write concise, informative, and motivational career advice articles."
                            },
                            {
                                role: "user",
                                content: `Analyze this job data: ${ JSON.stringify(allJobs.slice(0, 50)) }.
                                
1. Identify the most mentioned job titles.
2. Write a short article(max 500 words) that discusses these top jobs and suggests how someone could plan a career in them.
3. Keep it clear and encouraging, as if you're speaking to someone trying to decide on their future.`},
                        ],
temperature: 0.7
                    })
                });

const data = await response.json();
console.log("OpenAI raw response:", data);

if (data.choices && data.choices[0]) {
    setArticle(data.choices[0].message.content);
} else {
    setArticle("No response generated from OpenAI.");
}
            } catch (error) {
    console.error("OpenAI fetch error:", error);
    setArticle("Failed to fetch article from AI.");
} finally {
    setLoading(false);
}
        };

fetchOpenAIResponse();
    }, [allJobs]);

return (
    <div className="w-full">
        {loading ? (
            <div className="bg-[#1c1f23] rounded-xl border border-[#2c343c] p-8">
                <div className="flex flex-col items-center justify-center space-y-4">
                    {/* Custom Loading Animation */}
                    <div className="relative">
                        <div className="w-12 h-12 border-4 border-[#2c343c] border-t-blue-500 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-purple-500 rounded-full animate-spin animation-delay-75"></div>
                    </div>

                    {/* Loading Text with Typewriter Effect */}
                    <div className="text-center">
                        <h3 className="text-lg font-semibold text-white mb-2">
                            🤖 AI is analyzing job market data...
                        </h3>
                        <div className="flex items-center justify-center space-x-1">
                            <span className="text-gray-400">Generating insights</span>
                            <div className="flex space-x-1">
                                <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce"></div>
                                <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce animation-delay-100"></div>
                                <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce animation-delay-200"></div>
                            </div>
                        </div>
                    </div>

                    {/* Progress Steps */}
                    <div className="w-full max-w-md">
                        <div className="flex justify-between text-xs text-gray-500 mb-2">
                            <span>Analyzing Data</span>
                            <span>Processing Trends</span>
                            <span>Generating Report</span>
                        </div>
                        <div className="w-full bg-[#2c343c] rounded-full h-1">
                            <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-1 rounded-full animate-pulse" style={{ width: '70%' }}></div>
                        </div>
                    </div>
                </div>
            </div>
        ) : (
            <div className="bg-[#1c1f23] rounded-xl border border-[#2c343c] overflow-hidden">
                {/* Article Header */}
                <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 p-6 border-b border-[#2c343c]">
                    <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-lg">✨</span>
                            </div>
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-white">Career Intelligence Report</h3>
                            <p className="text-gray-400 text-sm">AI-powered analysis of current job market trends</p>
                        </div>
                        <div className="flex-shrink-0">
                            <div className="flex items-center space-x-2 bg-[#161a1d] px-3 py-1 rounded-full">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                <span className="text-xs text-gray-400">Live Data</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Article Content */}
                <div className="p-6">
                    {article ? (
                        <div className="prose prose-invert max-w-none">
                            <div
                                className="text-gray-300 leading-relaxed text-base"
                                style={{
                                    lineHeight: '1.7',
                                    fontFamily: 'system-ui, -apple-system, sans-serif'
                                }}
                            >
                                {article.split('\n').map((paragraph, index) => {
                                    // Handle headers (lines that start with #)
                                    if (paragraph.startsWith('# ')) {
                                        return (
                                            <h2 key={index} className="text-xl font-bold text-white mt-6 mb-3 first:mt-0">
                                                {paragraph.replace('# ', '')}
                                            </h2>
                                        );
                                    }
                                    // Handle subheaders (lines that start with ##)
                                    if (paragraph.startsWith('## ')) {
                                        return (
                                            <h3 key={index} className="text-lg font-semibold text-gray-200 mt-5 mb-2">
                                                {paragraph.replace('## ', '')}
                                            </h3>
                                        );
                                    }
                                    // Handle bullet points
                                    if (paragraph.startsWith('- ') || paragraph.startsWith('• ')) {
                                        return (
                                            <div key={index} className="flex items-start space-x-3 my-2">
                                                <div className="flex-shrink-0 w-1.5 h-1.5 bg-blue-500 rounded-full mt-2.5"></div>
                                                <p className="text-gray-300">{paragraph.replace(/^[•-]\s/, '')}</p>
                                            </div>
                                        );
                                    }
                                    // Handle numbered lists
                                    if (/^\d+\.\s/.test(paragraph)) {
                                        const number = paragraph.match(/^(\d+)\./)[1];
                                        const content = paragraph.replace(/^\d+\.\s/, '');
                                        return (
                                            <div key={index} className="flex items-start space-x-3 my-2">
                                                <div className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white text-xs font-bold rounded-full flex items-center justify-center mt-0.5">
                                                    {number}
                                                </div>
                                                <p className="text-gray-300">{content}</p>
                                            </div>
                                        );
                                    }
                                    // Handle regular paragraphs
                                    if (paragraph.trim() !== '') {
                                        return (
                                            <p key={index} className="text-gray-300 mb-4 last:mb-0">
                                                {paragraph}
                                            </p>
                                        );
                                    }
                                    return null;
                                })}
                            </div>

                            {/* Article Footer */}
                            <div className="mt-8 pt-6 border-t border-[#2c343c]">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                                        <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                                        <span>Analysis complete</span>
                                        <span>•</span>
                                        <span>{new Date().toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <div className="px-3 py-1 bg-blue-900/30 text-blue-400 text-xs font-medium rounded-full">
                                            AI Generated
                                        </div>
                                        <div className="px-3 py-1 bg-purple-900/30 text-purple-400 text-xs font-medium rounded-full">
                                            Career Insights
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-[#161a1d] rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">📊</span>
                            </div>
                            <h3 className="text-lg font-semibold text-white mb-2">No Data Available</h3>
                            <p className="text-gray-400 text-sm">
                                Click "Analyze Job Market" to generate AI-powered career insights
                            </p>
                        </div>
                    )}
                </div>
            </div>
        )}

        <style>{`
                @keyframes bounce {
                    0%, 20%, 53%, 80%, 100% {
                        transform: translate3d(0,0,0);
                    }
                    40%, 43% {
                        transform: translate3d(0, -4px, 0);
                    }
                    70% {
                        transform: translate3d(0, -2px, 0);
                    }
                    90% {
                        transform: translate3d(0, -1px, 0);
                    }
                }
                
                .animation-delay-75 {
                    animation-delay: 0.075s;
                }
                
                .animation-delay-100 {
                    animation-delay: 0.1s;
                }
                
                .animation-delay-200 {
                    animation-delay: 0.2s;
                }
                
                .prose-invert {
                    color: #d1d5db;
                }
            `}</style>
    </div>
);
};

export default JobInsightsWriter;