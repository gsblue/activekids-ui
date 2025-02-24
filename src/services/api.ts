import axios from 'axios';
import { LoginRequest, SignUpRequest, CreateEventRequest } from '../types';
import { store } from '../store';
import { logout } from '../store/slices/authSlice';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            store.dispatch(logout());
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: (data: LoginRequest) => 
        api.post('/auth/login', data),
    signup: (data: SignUpRequest) => 
        api.post('/auth/signup', data),
};

export const familyAPI = {
    getChildren: () => 
        api.get('/family/children'),
    addChild: (childData: any) =>
        api.post('/family/child', childData),
    getCategories: () => 
        api.get('/categories'),
    updateCategories: (categories: any[]) =>
        api.put('/categories', categories),
    updateChild: (childData: any) =>
        api.put('/family/child', childData),
    deleteChild: (childId: string) =>
        api.delete(`/family/child/${childId}`),
    getFamilySummary: () => 
        api.get('/family/summary'),
};

export const eventAPI = {
    getEvents: () => 
        api.get('/events'),
    createEvent: (eventData: CreateEventRequest) =>
        api.post('/events', eventData),
    updateEvent: (id: string, eventData: any) =>
        api.put(`/events/${id}`, eventData),
    deleteEvent: (id: string) =>
        api.delete(`/events/${id}`),
    getCategories: () =>
        api.get('/events/categories'),
    createCategory: (category: any) =>
        api.post('/events/categories', category),
    updateCategory: (id: string, category: any) =>
        api.put(`/events/categories/${id}`, category),
    deleteCategory: (id: string) =>
        api.delete(`/events/categories/${id}`),
};

export const analyticsAPI = {
    getChildStats: (childId: string) =>
        api.get(`/analytics/child/${childId}`),
    getFamilyStats: () =>
        api.get('/analytics/family'),
};

export default api; 