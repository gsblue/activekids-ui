import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { analyticsAPI } from '../../services/api';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart,
    Bar
} from 'recharts';

const Analytics: React.FC = () => {
    const { children } = useSelector((state: RootState) => state.family);
    const [selectedChild, setSelectedChild] = useState<string>('all');
    const [timeFrame, setTimeFrame] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
    const [data, setData] = useState<any[]>([]);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                let response;
                if (selectedChild === 'all') {
                    response = await analyticsAPI.getFamilyStats();
                } else {
                    response = await analyticsAPI.getChildStats(selectedChild);
                }
                setData(response.data);
            } catch (error) {
                console.error('Failed to fetch analytics:', error);
            }
        };

        fetchAnalytics();
    }, [selectedChild, timeFrame]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8 flex justify-between items-center">
                <h1 className="text-3xl font-bold">Analytics</h1>
                <div className="flex gap-4">
                    <select
                        value={selectedChild}
                        onChange={(e) => setSelectedChild(e.target.value)}
                        className="rounded border p-2"
                    >
                        <option value="all">All Children</option>
                        {children.map(child => (
                            <option key={child.id} value={child.id}>
                                {child.firstName}
                            </option>
                        ))}
                    </select>
                    <select
                        value={timeFrame}
                        onChange={(e) => setTimeFrame(e.target.value as any)}
                        className="rounded border p-2"
                    >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Points Over Time</h2>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="points" stroke="#8884d8" />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                    <h2 className="text-xl font-semibold mb-4">Category Distribution</h2>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={data}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="category" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="goodPoints" fill="#4CAF50" name="Good Points" />
                            <Bar dataKey="badPoints" fill="#f44336" name="Bad Points" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Analytics; 