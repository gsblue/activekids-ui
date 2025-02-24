import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { analyticsAPI } from '../../services/api';
import { formatDate, calculateAge } from '../../utils/dateUtils';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell
} from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const ChildProfile: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const child = useSelector((state: RootState) => 
        state.family.children?.find(c => c.id === id)
    );
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChildStats = async () => {
            try {
                const response = await analyticsAPI.getChildStats(id!);
                setStats(response.data);
            } catch (error) {
                console.error('Failed to fetch child stats:', error);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchChildStats();
        }
    }, [id]);

    if (loading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    if (!child) {
        return <div className="text-center text-red-500">Child not found</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h1 className="text-3xl font-bold mb-4">{child.firstName}'s Profile</h1>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-gray-600">
                        <p className="font-semibold">Age</p>
                        <p>{calculateAge(child.birthMonth, child.birthYear)} years old</p>
                    </div>
                    <div className="text-gray-600">
                        <p className="font-semibold">Total Points</p>
                        <p className={stats.totalPoints >= 0 ? 'text-green-500' : 'text-red-500'}>
                            {stats.totalPoints}
                        </p>
                    </div>
                    <div className="text-gray-600">
                        <p className="font-semibold">Events This Month</p>
                        <p>{stats.monthlyEvents}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Points History</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={stats.pointsHistory}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" tickFormatter={(date) => formatDate(date)} />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line 
                                type="monotone" 
                                dataKey="points" 
                                stroke="#8884d8" 
                                name="Points"
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h2 className="text-xl font-semibold mb-4">Category Distribution</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={stats.categoryDistribution}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {stats.categoryDistribution.map((entry: any, index: number) => (
                                    <Cell 
                                        key={`cell-${index}`} 
                                        fill={COLORS[index % COLORS.length]} 
                                        name={entry.name}
                                    />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Recent Events</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Category
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Points
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Notes
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {stats.recentEvents.map((event: any) => (
                                <tr key={event.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {formatDate(event.eventDate)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {event.category.name}
                                    </td>
                                    <td className={`px-6 py-4 whitespace-nowrap ${
                                        event.eventType === 'Good' ? 'text-green-500' : 'text-red-500'
                                    }`}>
                                        {event.eventType === 'Good' ? '+' : '-'}{event.points}
                                    </td>
                                    <td className="px-6 py-4">
                                        {event.notes}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ChildProfile; 