
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  relation: 'Mom' | 'Dad';
  familyId: string;
  createdAt: string;
}

export interface Child {
  id: string;
  familyId: string;
  firstName: string;
  birthMonth: number;
  birthYear: number;
  createdAt: string;
}

export interface EventCategory {
  id: string;
  familyId: string;
  name: string;
  type: 'Good' | 'Bad';
  points: number;
  createdAt: string;
}

export interface Event {
  id: string;
  familyId: string;
  childId: string;
  categoryId: string;
  eventDate: string;
  eventType: 'Good' | 'Bad';
  notes: string;
  points: number;
  createdAt: string;
  createdBy: string;
  category?: EventCategory;
  child?: Child;
}

export interface CreateEventRequest {
  childId: string;
  categoryId: string;
  eventDate: string;
  eventType: 'Good' | 'Bad';
  notes: string;
  points: number;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  relation: 'Mom' | 'Dad';
}

export interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface FamilyState {
  children: Child[];
  categories: EventCategory[];
  events: Event[];
  loading: boolean;
  error: string | null;
} 