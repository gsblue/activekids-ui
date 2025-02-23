import { useMemo } from 'react';
import { Event } from '../types';
import { calculateTotalPoints, calculatePointsByCategory } from '../utils/pointsCalculator';

export const usePoints = (events: Event[]) => {
    const totalPoints = useMemo(() => calculateTotalPoints(events), [events]);
    const pointsByCategory = useMemo(() => calculatePointsByCategory(events), [events]);

    return {
        totalPoints,
        pointsByCategory,
    };
}; 