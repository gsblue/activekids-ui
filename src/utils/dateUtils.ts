import { format, differenceInYears } from 'date-fns';

export const formatDate = (date: string | Date): string => {
    return format(new Date(date), 'MMM d, yyyy');
};

export const calculateAge = (birthMonth: number, birthYear: number): number => {
    const birthDate = new Date(birthYear, birthMonth - 1);
    return differenceInYears(new Date(), birthDate);
};

export const getMonthName = (month: number): string => {
    return format(new Date(2000, month - 1), 'MMMM');
}; 