import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { daysApi } from '../lib/api';
import type { Day, Photo } from '../types';
import { format } from 'date-fns';

export const DayDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [day, setDay] = useState<Day | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mood: '',
    rating: 8,
  });

  useEffect(() => {
    if (id) {
      loadDay(parseInt(id));
    }
  }, [id]);

  const loadDay = async (dayId: number) => {
    try {
      const [dayData, photosData] = await Promise.all([
        daysApi.getById(dayId),
        daysApi.getPhotos(dayId),
      ]);
      setDay(dayData);
      setPhotos(photosData);
      setFormData({
        title: dayData.title,
        description: dayData.description,
        mood: dayData.mood,
        rating: dayData.rating,
      });
    } catch (error) {
      console.error('Failed to load day:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    try {
      await daysApi.update(parseInt(id), formData);
      setIsEditing(false);
      loadDay(parseInt(id));
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update day');
    }
  };

  const handleDelete = async () => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this day?')) return;

    try {
      await daysApi.delete(parseInt(id));
      navigate('/days');
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete day');
    }
  };

  const moodOptions = ['😊', '😍', '🥰', '😄', '😎', '🤗', '💕', '❤️', '🌟', '✨'];

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </Layout>
    );
  }

  if (!day) {
    return (
      <Layout>
        <div className="card text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Day Not Found</h2>
          <Link to="/days" className="text-primary-600 hover:text-primary-700">
            Back to Days
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link to="/days" className="text-primary-600 hover:text-primary-700 flex items-center">
            ← Back to Days
          </Link>
          <div className="flex space-x-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="btn-secondary"
            >
              {isEditing ? 'Cancel Edit' : 'Edit'}
            </button>
            <button onClick={handleDelete} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">
              Delete
            </button>
          </div>
        </div>

        {/* Day Content */}
        {isEditing ? (
          <div className="card">
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mood
                </label>
                <div className="flex flex-wrap gap-2">
                  {moodOptions.map((mood) => (
                    <button
                      key={mood}
                      type="button"
                      onClick={() => setFormData({ ...formData, mood })}
                      className={`text-3xl p-2 rounded-lg transition-all ${
                        formData.mood === mood
                          ? 'bg-primary-100 ring-2 ring-primary-500'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      {mood}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rating (1-10)
                </label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  rows={6}
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setIsEditing(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="card">
            <div className="flex items-start space-x-4 mb-6">
              <span className="text-6xl">{day.mood}</span>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{day.title}</h1>
                <p className="text-gray-600">
                  {format(new Date(day.date), 'EEEE, MMMM dd, yyyy')}
                </p>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 text-primary-700 font-medium mt-2">
                  ⭐ {day.rating}/10
                </div>
              </div>
            </div>
            <div className="prose max-w-none">
              <p className="text-gray-800 whitespace-pre-wrap">{day.description}</p>
            </div>
          </div>
        )}

        {/* Photos */}
        {photos.length > 0 && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Photos</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photos.map((photo) => (
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
    </Layout>
  );
};
