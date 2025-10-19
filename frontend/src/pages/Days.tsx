import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '../components/Layout';
import { DayCalendar } from '../components/DayCalendar';
import { daysApi } from '../lib/api';
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
    mood: '😊',
    rating: 8,
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
      await daysApi.create(formData);
      setShowForm(false);
      setFormData({
        date: '',
        title: '',
        description: '',
        mood: '😊',
        rating: 8,
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input-field"
                  placeholder="Our amazing day at..."
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
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="input-field"
                  rows={4}
                  placeholder="Tell the story of this day..."
                  required
                />
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
                        <div className="flex items-center space-x-3 mb-2">
                          <span className="text-4xl">{day.mood}</span>
                          <div>
                            <h3 className="text-xl font-semibold text-gray-900">{day.title}</h3>
                            <p className="text-sm text-gray-500">
                              {format(new Date(day.date), 'EEEE, MMMM dd, yyyy')}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-700 line-clamp-2">{day.description}</p>
                      </div>
                      <div className="ml-4 text-right">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 text-primary-700 font-medium">
                          ⭐ {day.rating}/10
                        </div>
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
