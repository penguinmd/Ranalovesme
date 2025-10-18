import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { daysApi, placesApi, photosApi, musicApi, activitiesApi } from '../lib/api';
import type { DayStats, Day, Place, Photo } from '../types';
import { format } from 'date-fns';

export const Dashboard = () => {
  const [stats, setStats] = useState<DayStats | null>(null);
  const [recentDays, setRecentDays] = useState<Day[]>([]);
  const [recentPlaces, setRecentPlaces] = useState<Place[]>([]);
  const [recentPhotos, setRecentPhotos] = useState<Photo[]>([]);
  const [counts, setCounts] = useState({
    places: 0,
    photos: 0,
    music: 0,
    activities: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const [
        dayStats,
        days,
        places,
        photos,
        music,
        activities,
      ] = await Promise.all([
        daysApi.getStats(),
        daysApi.getAll(),
        placesApi.getAll(),
        photosApi.getAll(),
        musicApi.getAll(),
        activitiesApi.getAll(),
      ]);

      setStats(dayStats);
      setRecentDays(days.slice(0, 5));
      setRecentPlaces(places.slice(0, 5));
      setRecentPhotos(photos.slice(0, 6));
      setCounts({
        places: places.length,
        photos: photos.length,
        music: music.length,
        activities: activities.length,
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome to your relationship memory tracker</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card bg-gradient-to-br from-primary-500 to-pink-500 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Total Days Together</p>
                <p className="text-3xl font-bold mt-1">{stats?.total_days || 0}</p>
              </div>
              <div className="text-4xl">📅</div>
            </div>
            {stats?.average_rating && (
              <p className="text-sm mt-2 opacity-90">
                Avg Rating: {stats.average_rating.toFixed(1)}/10
              </p>
            )}
          </div>

          <div className="card bg-gradient-to-br from-blue-500 to-cyan-500 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Places Visited</p>
                <p className="text-3xl font-bold mt-1">{counts.places}</p>
              </div>
              <div className="text-4xl">📍</div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-purple-500 to-pink-500 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Photos</p>
                <p className="text-3xl font-bold mt-1">{counts.photos}</p>
              </div>
              <div className="text-4xl">📷</div>
            </div>
          </div>

          <div className="card bg-gradient-to-br from-green-500 to-teal-500 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm opacity-90">Music & Activities</p>
                <p className="text-3xl font-bold mt-1">{counts.music + counts.activities}</p>
              </div>
              <div className="text-4xl">🎵</div>
            </div>
          </div>
        </div>

        {/* Recent Days */}
        {recentDays.length > 0 && (
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Recent Days</h2>
              <Link to="/days" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                View all →
              </Link>
            </div>
            <div className="space-y-3">
              {recentDays.map((day) => (
                <Link
                  key={day.id}
                  to={`/days/${day.id}`}
                  className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-medium text-gray-900">{day.title}</h3>
                        <span className="text-2xl">{day.mood}</span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{day.description}</p>
                    </div>
                    <div className="text-right ml-4">
                      <p className="text-sm text-gray-500">{format(new Date(day.date), 'MMM dd, yyyy')}</p>
                      <p className="text-sm font-medium text-primary-600">Rating: {day.rating}/10</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recent Places and Photos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Places */}
          {recentPlaces.length > 0 && (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Recent Places</h2>
                <Link to="/places" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View all →
                </Link>
              </div>
              <div className="space-y-2">
                {recentPlaces.map((place) => (
                  <div key={place.id} className="p-3 bg-gray-50 rounded-lg">
                    <h3 className="font-medium text-gray-900">{place.name}</h3>
                    <p className="text-sm text-gray-600">{place.address}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-gray-500">{place.category}</span>
                      <span className="text-xs text-gray-500">
                        {format(new Date(place.visit_date), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Photos */}
          {recentPhotos.length > 0 && (
            <div className="card">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Recent Photos</h2>
                <Link to="/photos" className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                  View all →
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {recentPhotos.map((photo) => (
                  <div key={photo.id} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                    <img
                      src={`http://localhost:3001/uploads/${photo.filename}`}
                      alt={photo.caption}
                      className="w-full h-full object-cover hover:scale-110 transition-transform"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Empty State */}
        {stats?.total_days === 0 && (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">💕</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Start Your Journey</h2>
            <p className="text-gray-600 mb-6">Begin tracking your beautiful moments together</p>
            <div className="flex justify-center space-x-4">
              <Link to="/days" className="btn-primary">
                Add Your First Day
              </Link>
              <Link to="/places" className="btn-secondary">
                Add a Place
              </Link>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
