import React from 'react';

export interface ArtCardProps {
  title: string;
  imageUrl: string;
  description?: string;
  medium?: string;
  culture?: string;
  period?: string;
  onSave?: () => void;
  onDelete?: () => void;
}

const ArtCard: React.FC<ArtCardProps> = ({
  title,
  imageUrl,
  description,
  medium,
  culture,
  period,
  onSave,
  onDelete,
}) => {
  return (
    <div className="border rounded shadow p-4">
      <img src={imageUrl} alt={title} crossOrigin="anonymous" className="w-full h-64 object-cover mb-2" />
      <h2 className="font-bold mb-1">{title}</h2>
      {description && <p className="text-sm mb-1">{description}</p>}
      {medium && <p>Medium: {medium}</p>}
      {culture && <p>Culture: {culture}</p>}
      {period && <p>Period: {period}</p>}
      {onSave && <button onClick={onSave} className="bg-blue-500 text-white px-3 py-1 mt-2 rounded">Save</button>}
      {onDelete && <button onClick={onDelete} className="bg-red-500 text-white px-3 py-1 mt-2 rounded">Delete</button>}
    </div>
  );
};

export default ArtCard;

