import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { DayCalendar } from '../components/DayCalendar';
import { daysApi, photosApi } from '../lib/api';
import type { Day } from '../types';
import { format } from 'date-fns';

// Days page with calendar and list views
type ViewMode = 'calendar' | 'list';

export const Days = () => {
  const navigate = useNavigate();
  const [days, setDays] = useState<Day[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    title: '',
    description: '',
    photo: null as File | null,
  });

  useEffect(() => {
    loadDays();
  }, []);

  const loadDays = async () => {
    try {
      const data = await daysApi.getAll();
      setDays(data);
    } catch (error) {
      console.error('Failed to load days:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create the day first
      const dayData = {
        date: formData.date,
        title: formData.title || undefined,
        description: formData.description || undefined,
      };
      const response = await daysApi.create(dayData);
      const dayId = response.id;

      // If there's a photo, upload it and link it to the day
      if (formData.photo) {
        const uploadedPhoto = await photosApi.upload(formData.photo, {
          caption: formData.title || 'Day together',
          location: '',
          taken_date: formData.date,
        });
        await daysApi.addPhoto(dayId, uploadedPhoto.id);
      }

      setShowForm(false);
      setFormData({
        date: '',
        title: '',
        description: '',
        photo: null,
      });
      loadDays();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create day');
    }
  };

  const handleQuickAdd = async (date: Date) => {
    try {
      const dateStr = format(date, 'yyyy-MM-dd');
      await daysApi.create({ date: dateStr });
      loadDays();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to add day');
    }
  };

  const handleDayClick = (day: Day) => {
    navigate(`/days/${day.id}`);
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Days Together</h1>
            <p className="text-gray-600 mt-1">{days.length} memorable days</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="inline-flex rounded-lg border border-gray-200 bg-white p-1">
              <button
                onClick={() => setViewMode('calendar')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'calendar'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📅 Calendar
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  viewMode === 'list'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                📋 List
              </button>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn-primary"
            >
              {showForm ? 'Cancel' : '+ Add Details'}
            </button>
          </div>
        </div>

        {/* Add Day Form */}
        {showForm && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Add New Day</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date *
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field"
                  placeholder="A day at the park..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description <span className="text-gray-400 text-xs">(optional)</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  rows={3}
                  placeholder="What made this day special..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Photo <span className="text-gray-400 text-xs">(optional - to remind you of this day)</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFormData({ ...formData, photo: e.target.files?.[0] || null })}
                  className="input-field"
                />
                {formData.photo && (
                  <p className="text-sm text-gray-600 mt-1">Selected: {formData.photo.name}</p>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Day
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <div className="card">
            <DayCalendar
              days={days}
              onQuickAdd={handleQuickAdd}
              onDayClick={handleDayClick}
            />
          </div>
        )}

        {/* List View */}
        {viewMode === 'list' && (
          <>
            {days.length === 0 ? (
              <div className="card text-center py-12">
                <div className="text-6xl mb-4">📅</div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Days Yet</h2>
                <p className="text-gray-600 mb-6">Start recording your memorable days together</p>
                <button onClick={() => setShowForm(true)} className="btn-primary">
                  Add Your First Day
                </button>
              </div>
            ) : (
              <div className="grid gap-4">
                {days.map((day) => (
                  <Link
                    key={day.id}
                    to={`/days/${day.id}`}
                    className="card hover:shadow-lg transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">
                          {day.title || 'Day Together'}
                        </h3>
                        <p className="text-sm text-gray-500 mb-2">
                          {format(new Date(day.date), 'EEEE, MMMM dd, yyyy')}
                        </p>
                        {day.description && (
                          <p className="text-gray-700 line-clamp-2">{day.description}</p>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};
