import React, { useEffect, useState } from 'react';
import { fetchGallery, saveArtObject, ArtObject } from '../api/artApi';
import ArtCard from '../components/ArtCard';
import { placeholder } from '@babel/types';

// 
interface HarvardArtObject {
  id: string;
  title: string;
  primaryimageurl?: string;
  description?: string;
}

const Gallery: React.FC = () => {
  const [artObjects, setArtObjects] = useState<ArtObject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    const getData = async () => {
      try {
        console.log('fetching gallery0:');
        const data: (ArtObject | HarvardArtObject)[] = await fetchGallery();
        console.log('Raw gallery data:', data);
        const formattedData: ArtObject[] = data.map(obj => ({
          _id: '_id' in obj ? obj._id : obj.id.toString(),
          title: obj.title || 'Untitled',
          imageUrl:
               (obj as any).imageUrl ||
               (obj as any).primaryimageurl || 
               'https://via.placeholder.com/300x300?text=No+Image',
          description: obj.description || '',
        }));
        console.log('Fetched and formatted gallery data:', formattedData);
        setArtObjects(formattedData);
      } catch (err) {
        console.error('Error fetching gallery:', err);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const handleSave = async (obj: ArtObject) => {
    if (!token) {
      alert('Please log in to save objects.');
      return;
    }
    try {
      await saveArtObject(obj, token);
      alert('Saved to your collection!');
    } catch (err) {
      console.error('Error saving object:', err);
      alert('Failed to save object.');
    }
  };

  if (loading) return <p className="p-4">Loading gallery...</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {artObjects.map(obj => (
        <ArtCard
          key={obj._id}
          title={obj.title}
          imageUrl={obj.imageUrl}
          description={obj.description}
          onSave={() => handleSave(obj)}
        />
      ))}
    </div>
  );
};

export default Gallery;






