

import axios from 'axios';

const API_URL = 'https://irina-khameeva-final-node-project.onrender.com/api/v1/art';

// Типы
export interface ArtObject {
  _id: string;
  title: string;
  imageUrl:string
  description?: string;
  medium?: string;     
  culture?: string;   
  period?: string;
}

export interface LoginResponse {
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
}

export const fetchGallery = async (page = 1): Promise<ArtObject[]> => {
  console.log('fetching gallery');
  const res = await axios.get<ArtObject[]>(`${API_URL}/gallery?page=${page}`);
  console.log('API response for gallery:', res);
  return res.data;
};

export const saveArtObject = async (object: ArtObject, token: string): Promise<ArtObject> => {
  const res = await axios.post<ArtObject>(`${API_URL}/save`, object, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

export const fetchUserCollection = async (token: string): Promise<ArtObject[]> => {
  const res = await axios.get<ArtObject[]>(`${API_URL}/mycollection`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  console.log('API response for user gallery:', res);
  return res.data;
};

export const deleteArtObject = async (id: string, token: string): Promise<{ msg: string }> => {
  const res = await axios.delete<{ msg: string }>(`${API_URL}/mycollection/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

