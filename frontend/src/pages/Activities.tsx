import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { activitiesApi } from '../lib/api';
import type { Activity } from '../types';
import { format } from 'date-fns';

export const ActivitiesPage = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'outdoor',
    date: '',
  });

  useEffect(() => {
    loadActivities();
  }, [filterCategory]);

  const loadActivities = async () => {
    try {
      const data = await activitiesApi.getAll(filterCategory === 'all' ? undefined : filterCategory);
      setActivities(data);
    } catch (error) {
      console.error('Failed to load activities:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await activitiesApi.create(formData);
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        category: 'outdoor',
        date: '',
      });
      loadActivities();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create activity');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this activity?')) return;

    try {
      await activitiesApi.delete(id);
      loadActivities();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete activity');
    }
  };

  const categories = [
    { value: 'outdoor', label: '🏞️ Outdoor', color: 'bg-green-100 text-green-700' },
    { value: 'indoor', label: '🏠 Indoor', color: 'bg-blue-100 text-blue-700' },
    { value: 'sports', label: '⚽ Sports', color: 'bg-orange-100 text-orange-700' },
    { value: 'cultural', label: '🎭 Cultural', color: 'bg-purple-100 text-purple-700' },
    { value: 'food', label: '🍳 Food & Cooking', color: 'bg-red-100 text-red-700' },
    { value: 'travel', label: '✈️ Travel', color: 'bg-teal-100 text-teal-700' },
    { value: 'other', label: '🎯 Other', color: 'bg-gray-100 text-gray-700' },
  ];

  const getCategoryStyle = (category: string) => {
    return categories.find((c) => c.value === category)?.color || 'bg-gray-100 text-gray-700';
  };

  const getCategoryLabel = (category: string) => {
    return categories.find((c) => c.value === category)?.label || category;
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
            <h1 className="text-3xl font-bold text-gray-900">Our Activities</h1>
            <p className="text-gray-600 mt-1">{activities.length} shared experiences</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary"
          >
            {showForm ? 'Cancel' : '+ Add Activity'}
          </button>
        </div>

        {/* Filter */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterCategory('all')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filterCategory === 'all'
                ? 'bg-primary-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setFilterCategory(cat.value)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterCategory === cat.value
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Add Activity Form */}
        {showForm && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Add New Activity</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Activity Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="input-field"
                    placeholder="Hiking at sunset..."
                    required
                  />
                </div>

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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="input-field"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
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
                  placeholder="Describe the activity and what made it special..."
                  required
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Activity
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Activities List */}
        {activities.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Activities Yet</h2>
            <p className="text-gray-600 mb-6">Start tracking the things you do together</p>
            <button onClick={() => setShowForm(true)} className="btn-primary">
              Add Your First Activity
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activities.map((activity) => (
              <div key={activity.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-900 flex-1">{activity.title}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ml-2 ${getCategoryStyle(activity.category)}`}>
                    {getCategoryLabel(activity.category)}
                  </span>
                </div>
                <p className="text-gray-700 mb-3 whitespace-pre-wrap">{activity.description}</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    {format(new Date(activity.date), 'MMMM dd, yyyy')}
                  </p>
                  <button
                    onClick={() => handleDelete(activity.id)}
                    className="text-red-600 hover:text-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};
