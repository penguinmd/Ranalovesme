// User types
export interface User {
  id: number;
  username: string;
  display_name: string;
  created_at: string;
}

export interface AuthUser extends User {
  password?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  password: string;
  display_name: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Day types
export interface Day {
  id: number;
  date: string;
  title: string;
  description: string;
  mood: string;
  rating: number;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface DayFormData {
  date: string;
  title?: string;
  description?: string;
  mood?: string;
  rating?: number;
}

export interface DayStats {
  total_days: number;
  first_day: string | null;
  latest_day: string | null;
  average_rating: number;
}

// Place types
export interface Place {
  id: number;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  category: string;
  visit_date: string;
  notes: string;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface PlaceFormData {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  category: string;
  visit_date: string;
  notes: string;
}

// Photo types
export interface Photo {
  id: number;
  filename: string;
  original_name: string;
  caption: string;
  location: string;
  taken_date: string;
  uploaded_by: number;
  created_at: string;
}

export interface PhotoFormData {
  caption: string;
  location: string;
  taken_date: string;
}

// Music types
export interface Music {
  id: number;
  type: 'song' | 'concert' | 'artist';
  name: string;
  artist: string;
  spotify_uri: string;
  date: string;
  venue: string;
  notes: string;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface MusicFormData {
  type: 'song' | 'concert' | 'artist';
  name: string;
  artist: string;
  spotify_uri?: string;
  date: string;
  venue?: string;
  notes?: string;
}

// Activity types
export interface Activity {
  id: number;
  title: string;
  description: string;
  category: string;
  date: string;
  created_by: number;
  created_at: string;
  updated_at: string;
}

export interface ActivityFormData {
  title: string;
  description: string;
  category: string;
  date: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
