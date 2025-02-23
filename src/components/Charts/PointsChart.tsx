import React from 'react';
import { 
    ResponsiveContainer, 
    LineChart, 
    Line, 
    XAxis, 
    YAxis, 
    CartesianGrid, 
    Tooltip 
} from 'recharts';  // Changed from 'recharts/lib/index.js'
import { Event } from '../../types';
import { formatDate } from '../../utils/dateUtils';
import { fadeIn } from '../../utils/animations';

interface PointsChartProps {
    data: Event[];
}

const PointsChart: React.FC<PointsChartProps> = ({ data }) => {
    const chartData = data.reduce((acc: any[], event) => {
        const date = formatDate(event.eventDate);
        const existingDate = acc.find(item => item.date === date);
        
        const points = event.eventType === 'Good' ? event.points : -event.points;
        
        if (existingDate) {
            existingDate.points += points;
        } else {
            acc.push({ date, points });
        }
        
        return acc;
    }, []);

    return (
        <div className={`w-full h-[300px] ${fadeIn}`}>
            <ResponsiveContainer width="100%" height="100%">
                <LineChart width={500} height={300} data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="date" stroke="#6B7280" fontSize={12} tickLine={false} />
                    <YAxis stroke="#6B7280" fontSize={12} tickLine={false} />
                    <Tooltip />
                    <Line 
                        type="monotone" 
                        dataKey="points" 
                        stroke="#3B82F6" 
                        strokeWidth={2}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};

export default PointsChart; 