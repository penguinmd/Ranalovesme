import { useEffect, useState } from 'react';
import { Layout } from '../components/Layout';
import { photosApi } from '../lib/api';
import type { Photo } from '../types';
import { format } from 'date-fns';

export const Photos = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [uploadData, setUploadData] = useState({
    file: null as File | null,
    caption: '',
    location: '',
    taken_date: '',
  });

  useEffect(() => {
    loadPhotos();
  }, []);

  const loadPhotos = async () => {
    try {
      const data = await photosApi.getAll();
      setPhotos(data);
    } catch (error) {
      console.error('Failed to load photos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadData({ ...uploadData, file: e.target.files[0] });
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadData.file) return;

    try {
      await photosApi.upload(uploadData.file, {
        caption: uploadData.caption,
        location: uploadData.location,
        taken_date: uploadData.taken_date,
      });
      setShowUploadForm(false);
      setUploadData({
        file: null,
        caption: '',
        location: '',
        taken_date: '',
      });
      loadPhotos();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to upload photo');
    }
  };

  const handleDelete = async (photoId: number) => {
    if (!confirm('Are you sure you want to delete this photo?')) return;

    try {
      await photosApi.delete(photoId);
      setSelectedPhoto(null);
      loadPhotos();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete photo');
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
            <h1 className="text-3xl font-bold text-gray-900">Photo Gallery</h1>
            <p className="text-gray-600 mt-1">{photos.length} precious memories</p>
          </div>
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            className="btn-primary"
          >
            {showUploadForm ? 'Cancel' : '+ Upload Photo'}
          </button>
        </div>

        {/* Upload Form */}
        {showUploadForm && (
          <div className="card">
            <h2 className="text-xl font-semibold mb-4">Upload New Photo</h2>
            <form onSubmit={handleUpload} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Photo File
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Caption
                </label>
                <input
                  type="text"
                  value={uploadData.caption}
                  onChange={(e) => setUploadData({ ...uploadData, caption: e.target.value })}
                  className="input-field"
                  placeholder="A beautiful moment..."
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={uploadData.location}
                    onChange={(e) => setUploadData({ ...uploadData, location: e.target.value })}
                    className="input-field"
                    placeholder="Where was this taken?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date Taken
                  </label>
                  <input
                    type="date"
                    value={uploadData.taken_date}
                    onChange={(e) => setUploadData({ ...uploadData, taken_date: e.target.value })}
                    className="input-field"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button type="button" onClick={() => setShowUploadForm(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Upload Photo
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Photo Grid */}
        {photos.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">📷</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Photos Yet</h2>
            <p className="text-gray-600 mb-6">Start building your photo gallery</p>
            <button onClick={() => setShowUploadForm(true)} className="btn-primary">
              Upload Your First Photo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                onClick={() => setSelectedPhoto(photo)}
                className="aspect-square bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:ring-2 hover:ring-primary-500 transition-all"
              >
                <img
                  src={photosApi.getUrl(photo.filename)}
                  alt={photo.caption}
                  className="w-full h-full object-cover hover:scale-110 transition-transform"
                />
              </div>
            ))}
          </div>
        )}

        {/* Photo Modal */}
        {selectedPhoto && (
          <div
            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedPhoto(null)}
          >
            <div
              className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img
                  src={photosApi.getUrl(selectedPhoto.filename)}
                  alt={selectedPhoto.caption}
                  className="w-full h-auto"
                />
                <button
                  onClick={() => setSelectedPhoto(null)}
                  className="absolute top-4 right-4 bg-white rounded-full p-2 hover:bg-gray-100"
                >
                  ✕
                </button>
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">{selectedPhoto.caption}</h2>
                {selectedPhoto.location && (
                  <p className="text-gray-600 mb-2">📍 {selectedPhoto.location}</p>
                )}
                <p className="text-gray-500 text-sm mb-4">
                  Taken on {format(new Date(selectedPhoto.taken_date), 'MMMM dd, yyyy')}
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => handleDelete(selectedPhoto.id)}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
                  >
                    Delete Photo
                  </button>
                  <button onClick={() => setSelectedPhoto(null)} className="btn-secondary">
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};
