import axios from 'axios';

const API_URL = 'https://irina-khameeva-final-node-project.onrender.com/api/v1/auth';

export interface LoginResponse {
  token: string;
  user: {
    _id: string;
    name: string;
    email: string;
  };
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}


export const loginUser = async (email: string, password: string): Promise<LoginResponse> => {
  const res = await axios.post<LoginResponse>(`${API_URL}/login`, { email, password });
  return res.data;
};


export const registerUser = async (
  username: string,
  email: string,
  password: string
): Promise<LoginResponse> => {
  const res = await axios.post<LoginResponse>(`${API_URL}/register`, {
    name: username, 
    email,
    password,
  });
  return res.data;
};
