import React, { useEffect, useState } from 'react';
import { fetchUserCollection, deleteArtObject, ArtObject } from '../api/artApi';
import ArtCard from '../components/ArtCard';

const MyCollection: React.FC = () => {
  const [collection, setCollection] = useState<ArtObject[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    const getData = async () => {
      if (!token) return;
      try {
        const data = await fetchUserCollection(token);
        const formattedData: ArtObject[] = data.map(obj => ({
          _id: '_id' in obj ? obj._id : obj,
          title: obj.title || 'Untitled',
          imageUrl:
               (obj as any).image ||
               (obj as any).imageUrl ||
               (obj as any).primaryimageurl || 
               'https://via.placeholder.com/500x500?text=No+Image',
          description: obj.description || '',
        }));
        setCollection(formattedData);
      } catch (err) {
        console.error('Error fetching user collection:', err);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, [token]);

  const handleDelete = async (id: string) => {
    if (!token) return;
    try {
      await deleteArtObject(id, token);
      setCollection(prev => prev.filter(obj => obj._id !== id));
    } catch (err) {
      console.error('Error deleting object:', err);
      alert('Failed to delete object.');
    }
  };

  if (loading) return <p className="p-4">Loading your collection...</p>;
  if (!collection.length) return <p className="p-4">No items in your collection.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4">
      {collection.map(obj => (
        <ArtCard
          key={obj._id}
          title={obj.title}
          imageUrl={obj.imageUrl}
          description={obj.description}
          medium={obj.medium}
          culture={obj.culture}
          period={obj.period}
          onDelete={() => handleDelete(obj._id)}
        />
      ))}
    </div>
  );
};

export default MyCollection;


