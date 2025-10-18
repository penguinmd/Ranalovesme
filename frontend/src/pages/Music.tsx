import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { musicApi } from '../lib/api';
import type { Music } from '../types';
import { format } from 'date-fns';

export const MusicPage = () => {
  const [musicItems, setMusicItems] = useState<Music[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [formData, setFormData] = useState({
    type: 'song' as 'song' | 'concert' | 'artist',
    name: '',
    artist: '',
    spotify_uri: '',
    date: '',
    venue: '',
    notes: '',
  });

  useEffect(() => {
    loadMusic();
  }, [filterType]);

  const loadMusic = async () => {
    try {
      const data = await musicApi.getAll(filterType === 'all' ? undefined : filterType);
      setMusicItems(data);
    } catch (error) {
      console.error('Failed to load music:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await musicApi.create(formData);
      setShowForm(false);
      setFormData({
        type: 'song',
        name: '',
        artist: '',
        spotify_uri: '',
        date: '',
        venue: '',
        notes: '',
      });
      loadMusic();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create music entry');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;

    try {
      await musicApi.delete(id);
      loadMusic();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete entry');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'song':
        return '🎵';
      case 'concert':
        return '🎤';
      case 'artist':
        return '👨‍🎤';
      default:
        return '🎵';
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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Our Music</h1>
            <p className="text-gray-600 mt-1">{musicItems.length} musical memories</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="btn-primary"
          >
            {showForm ? 'Cancel' : '+ Add Music'}
          </button>
        </div>

        {/* Filter */}
        <div className="flex space-x-2">
          {['all', 'song', 'concert', 'artist'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterType === type
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1) + 's'}
            </button>
          ))}
        </div>

        {/* Add Music Form */}
        {showForm && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Add Music Entry</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                    className="input-field"
                    required
                  >
                    <option value="song">Song</option>
                    <option value="concert">Concert</option>
                    <option value="artist">Artist</option>
                  </select>
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
                  {formData.type === 'concert' ? 'Concert Name' : formData.type === 'artist' ? 'Artist Name' : 'Song Name'}
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input-field"
                  placeholder="Our favorite song..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Artist
                </label>
                <input
                  type="text"
                  value={formData.artist}
                  onChange={(e) => setFormData({ ...formData, artist: e.target.value })}
                  className="input-field"
                  placeholder="Artist name"
                  required
                />
              </div>

              {formData.type === 'concert' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Venue
                  </label>
                  <input
                    type="text"
                    value={formData.venue}
                    onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                    className="input-field"
                    placeholder="Concert venue"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Spotify URI (optional)
                </label>
                <input
                  type="text"
                  value={formData.spotify_uri}
                  onChange={(e) => setFormData({ ...formData, spotify_uri: e.target.value })}
                  className="input-field"
                  placeholder="spotify:track:..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="input-field"
                  rows={3}
                  placeholder="Why this is special..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Music List */}
        {musicItems.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">🎵</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Music Yet</h2>
            <p className="text-gray-600 mb-6">Start tracking the soundtrack of your relationship</p>
            <button onClick={() => setShowForm(true)} className="btn-primary">
              Add Your First Entry
            </button>
          </div>
        ) : (
          <div className="grid gap-4">
            {musicItems.map((item) => (
              <div key={item.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <span className="text-4xl">{getTypeIcon(item.type)}</span>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-xl font-semibold text-gray-900">{item.name}</h3>
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-primary-100 text-primary-700">
                          {item.type}
                        </span>
                      </div>
                      <p className="text-gray-700 font-medium">{item.artist}</p>
                      {item.venue && (
                        <p className="text-sm text-gray-600">📍 {item.venue}</p>
                      )}
                      {item.notes && (
                        <p className="text-gray-600 mt-2">{item.notes}</p>
                      )}
                      <p className="text-sm text-gray-500 mt-2">
                        {format(new Date(item.date), 'MMMM dd, yyyy')}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-red-600 hover:text-red-700 px-3 py-1 text-sm"
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
