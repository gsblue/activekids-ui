import { Event } from '../types';

export const calculateTotalPoints = (events: Event[]): number => {
    return events.reduce((total, event) => {
        const points = event.eventType === 'Good' ? event.points : -event.points;
        return total + points;
    }, 0);
};

export const calculatePointsByCategory = (events: Event[]) => {
    return events.reduce((acc, event) => {
        const category = event.category?.name || 'Uncategorized';
        if (!acc[category]) {
            acc[category] = 0;
        }
        acc[category] += event.eventType === 'Good' ? event.points : -event.points;
        return acc;
    }, {} as Record<string, number>);
}; 