import React from 'react';
import { 
    ResponsiveContainer, 
    BarChart,
    Bar,
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip,
    Legend
} from 'recharts';
import { ChildSummary } from '../../types';
import { fadeIn } from '../../utils/animations';

interface PointsChartProps {
    data: ChildSummary[];
}

const PointsChart: React.FC<PointsChartProps> = ({ data }) => {
    const chartData = data.map(child => ({
        name: child.firstName,
        points: child.totalPoints,
        good: child.goodActivities,
        bad: child.badActivities
    }));

    return (
        <div className={`w-full h-[300px] ${fadeIn}`}>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="name" stroke="#6B7280" fontSize={12} tickLine={false} />
                    <YAxis stroke="#6B7280" fontSize={12} tickLine={false} />
                    <Tooltip />
                    <Legend />
                    <Bar 
                        dataKey="points" 
                        name="Total Points"
                        fill="#3B82F6" 
                    />
                    <Bar 
                        dataKey="good" 
                        name="Good Activities"
                        fill="#34D399" 
                    />
                    <Bar 
                        dataKey="bad" 
                        name="Bad Activities"
                        fill="#F87171" 
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PointsChart; 