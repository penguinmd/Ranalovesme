import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { placesApi } from '../lib/api';
import type { Place } from '../types';
import { format } from 'date-fns';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

export const Places = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    latitude: 40.7128,
    longitude: -74.0060,
    category: 'restaurant',
    visit_date: '',
    notes: '',
  });

  useEffect(() => {
    loadPlaces();
  }, []);

  const loadPlaces = async () => {
    try {
      const data = await placesApi.getAll();
      setPlaces(data);
    } catch (error) {
      console.error('Failed to load places:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await placesApi.create(formData);
      setShowForm(false);
      setFormData({
        name: '',
        address: '',
        latitude: 40.7128,
        longitude: -74.0060,
        category: 'restaurant',
        visit_date: '',
        notes: '',
      });
      loadPlaces();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create place');
    }
  };

  const categories = [
    { value: 'restaurant', label: '🍽️ Restaurant', color: 'bg-red-100 text-red-700' },
    { value: 'cafe', label: '☕ Cafe', color: 'bg-amber-100 text-amber-700' },
    { value: 'park', label: '🌳 Park', color: 'bg-green-100 text-green-700' },
    { value: 'museum', label: '🏛️ Museum', color: 'bg-purple-100 text-purple-700' },
    { value: 'beach', label: '🏖️ Beach', color: 'bg-blue-100 text-blue-700' },
    { value: 'other', label: '📍 Other', color: 'bg-gray-100 text-gray-700' },
  ];

  const getCategoryStyle = (category: string) => {
    return categories.find((c) => c.value === category)?.color || 'bg-gray-100 text-gray-700';
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
            <h1 className="text-3xl font-bold text-gray-900">Places We've Been</h1>
            <p className="text-gray-600 mt-1">{places.length} special places</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode('list')}
              className={viewMode === 'list' ? 'btn-primary' : 'btn-secondary'}
            >
              📋 List
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={viewMode === 'map' ? 'btn-primary' : 'btn-secondary'}
            >
              🗺️ Map
            </button>
            <button
              onClick={() => setShowForm(!showForm)}
              className="btn-primary"
            >
              {showForm ? 'Cancel' : '+ Add Place'}
            </button>
          </div>
        </div>

        {/* Add Place Form */}
        {showForm && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Add New Place</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Place Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="input-field"
                    placeholder="The cozy cafe we love..."
                    required
                  />
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
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="input-field"
                  placeholder="123 Main St, City, State"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Latitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Longitude
                  </label>
                  <input
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
                    className="input-field"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Visit Date
                  </label>
                  <input
                    type="date"
                    value={formData.visit_date}
                    onChange={(e) => setFormData({ ...formData, visit_date: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
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
                  placeholder="What made this place special?"
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Save Place
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Places Content */}
        {places.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">📍</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Places Yet</h2>
            <p className="text-gray-600 mb-6">Start mapping your journey together</p>
            <button onClick={() => setShowForm(true)} className="btn-primary">
              Add Your First Place
            </button>
          </div>
        ) : viewMode === 'list' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {places.map((place) => (
              <div key={place.id} className="card hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900">{place.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryStyle(place.category)}`}>
                    {categories.find((c) => c.value === place.category)?.label}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{place.address}</p>
                <p className="text-sm text-gray-700 mb-3">{place.notes}</p>
                <p className="text-xs text-gray-500">
                  Visited: {format(new Date(place.visit_date), 'MMM dd, yyyy')}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="card">
            <div style={{ height: '600px', width: '100%' }}>
              <MapContainer
                center={places.length > 0 ? [places[0].latitude, places[0].longitude] : [40.7128, -74.0060]}
                zoom={10}
                style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {places.map((place) => (
                  <Marker key={place.id} position={[place.latitude, place.longitude]}>
                    <Popup>
                      <div className="p-2">
                        <h3 className="font-semibold">{place.name}</h3>
                        <p className="text-sm text-gray-600">{place.address}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(new Date(place.visit_date), 'MMM dd, yyyy')}
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
