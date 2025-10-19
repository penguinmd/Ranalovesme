import axios from 'axios';
import type {
  AuthResponse,
  LoginCredentials,
  RegisterData,
  Day,
  DayFormData,
  DayStats,
  Place,
  PlaceFormData,
  Photo,
  PhotoFormData,
  Music,
  MusicFormData,
  Activity,
  ActivityFormData,
} from '../types';

const API_BASE_URL = import.meta.env.PROD
  ? 'https://ranalovesme-production.up.railway.app/api'
  : 'http://localhost:3001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/login', credentials);
    return data;
  },

  register: async (userData: RegisterData): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/register', userData);
    return data;
  },

  getCurrentUser: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  },
};

// Days API
export const daysApi = {
  getAll: async (): Promise<Day[]> => {
    const { data } = await api.get('/days');
    return data;
  },

  getById: async (id: number): Promise<Day> => {
    const { data } = await api.get(`/days/${id}`);
    return data;
  },

  create: async (dayData: DayFormData): Promise<Day> => {
    const { data } = await api.post('/days', dayData);
    return data;
  },

  update: async (id: number, dayData: Partial<DayFormData>): Promise<void> => {
    await api.put(`/days/${id}`, dayData);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/days/${id}`);
  },

  getStats: async (): Promise<DayStats> => {
    const { data } = await api.get('/days/stats');
    return data;
  },

  getPhotos: async (id: number): Promise<Photo[]> => {
    const { data } = await api.get(`/days/${id}/photos`);
    return data;
  },

  addPhoto: async (dayId: number, photoId: number): Promise<void> => {
    await api.post(`/days/${dayId}/photos/${photoId}`);
  },

  removePhoto: async (dayId: number, photoId: number): Promise<void> => {
    await api.delete(`/days/${dayId}/photos/${photoId}`);
  },
};

// Places API
export const placesApi = {
  getAll: async (): Promise<Place[]> => {
    const { data } = await api.get('/places');
    return data;
  },

  getById: async (id: number): Promise<Place> => {
    const { data } = await api.get(`/places/${id}`);
    return data;
  },

  create: async (placeData: PlaceFormData): Promise<Place> => {
    const { data } = await api.post('/places', placeData);
    return data;
  },

  update: async (id: number, placeData: Partial<PlaceFormData>): Promise<void> => {
    await api.put(`/places/${id}`, placeData);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/places/${id}`);
  },

  getPhotos: async (id: number): Promise<Photo[]> => {
    const { data } = await api.get(`/places/${id}/photos`);
    return data;
  },

  addPhoto: async (placeId: number, photoId: number): Promise<void> => {
    await api.post(`/places/${placeId}/photos/${photoId}`);
  },

  removePhoto: async (placeId: number, photoId: number): Promise<void> => {
    await api.delete(`/places/${placeId}/photos/${photoId}`);
  },
};

// Photos API
export const photosApi = {
  getAll: async (): Promise<Photo[]> => {
    const { data } = await api.get('/photos');
    return data;
  },

  getById: async (id: number): Promise<Photo> => {
    const { data } = await api.get(`/photos/${id}`);
    return data;
  },

  upload: async (file: File, metadata: PhotoFormData): Promise<Photo> => {
    const formData = new FormData();
    formData.append('photo', file);
    formData.append('caption', metadata.caption);
    formData.append('location', metadata.location);
    formData.append('taken_date', metadata.taken_date);

    const { data } = await api.post('/photos', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return data;
  },

  update: async (id: number, metadata: Partial<PhotoFormData>): Promise<void> => {
    await api.put(`/photos/${id}`, metadata);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/photos/${id}`);
  },

  getUrl: (filename: string): string => {
    const baseUrl = import.meta.env.PROD
      ? 'https://ranalovesme-production.up.railway.app'
      : 'http://localhost:3001';
    return `${baseUrl}/uploads/${filename}`;
  },
};

// Music API
export const musicApi = {
  getAll: async (type?: string): Promise<Music[]> => {
    const { data } = await api.get('/music', { params: { type } });
    return data;
  },

  getById: async (id: number): Promise<Music> => {
    const { data } = await api.get(`/music/${id}`);
    return data;
  },

  create: async (musicData: MusicFormData): Promise<Music> => {
    const { data } = await api.post('/music', musicData);
    return data;
  },

  update: async (id: number, musicData: Partial<MusicFormData>): Promise<void> => {
    await api.put(`/music/${id}`, musicData);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/music/${id}`);
  },
};

// Activities API
export const activitiesApi = {
  getAll: async (category?: string): Promise<Activity[]> => {
    const { data } = await api.get('/activities', { params: { category } });
    return data;
  },

  getById: async (id: number): Promise<Activity> => {
    const { data } = await api.get(`/activities/${id}`);
    return data;
  },

  create: async (activityData: ActivityFormData): Promise<Activity> => {
    const { data } = await api.post('/activities', activityData);
    return data;
  },

  update: async (id: number, activityData: Partial<ActivityFormData>): Promise<void> => {
    await api.put(`/activities/${id}`, activityData);
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/activities/${id}`);
  },
};

export default api;
