import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="bg-gray-800 text-white p-4 flex justify-between">
      <div className="flex gap-4">
        <Link to="/">Gallery</Link>
        {token && <Link to="/mycollection">My Collection</Link>}
      </div>
      <div>
        {token ? (
          <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded">Logout</button>
        ) : (
          <Link to="/login" className="bg-blue-500 px-3 py-1 rounded">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

