import { useEffect, useState } from 'react';
import './Header.css';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import { ENDPOINT } from '../../App';

const Header = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      enqueueSnackbar('No refresh token found.', { variant: 'warning' });
      return;
    }

    try {
      await axios.post(ENDPOINT + 'auth/logout', { refreshToken });

      // Clear local storage
      localStorage.clear();

      enqueueSnackbar('Logged out successfully.', { variant: 'success' });
      navigate('/login');
    } catch (error) {
      console.error(error);
    }
    localStorage.clear();
    setIsLoggedIn(false);
  };

  useEffect(() => {
    //Check if already loggedin
    const token = localStorage.getItem('accessToken');
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [location]);

  return (
    <div className='header-container' sticky="top">
      <div className="heading">
        <h1>Levich Assignment</h1>
      </div>

      <ul className='menu'>
        {!isLoggedIn ? (location.pathname === "/register" ?
          <li className='menu-item'>
            <Link to="/login">Login</Link>
          </li>
          :
          <li className="menu-item">
            <Link to="/register">Register</Link>
          </li>)
          :
          <li className='menu-item'>
            <Link to="/login" onClick={handleLogout}>Logout</Link>
          </li>}
      </ul>
    </div>
  )
}

export default Header;