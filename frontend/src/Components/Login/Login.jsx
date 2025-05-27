import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { ENDPOINT } from '../../App';

const Login = () => {

  const [userEntry, setUserEntry] = useState({
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserEntry(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = userEntry;

    // Check if all required fields are filled
    if (!email || !password) {
      enqueueSnackbar("Fill all the required fields!", { variant: 'warning' });
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post(ENDPOINT + 'auth/login', {
        email,
        password
      });

      const { data, accessToken, refreshToken } = response.data;

      // Save account data and tokens in localStorage
      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // Clear the form and navigate to comments page
      setUserEntry({ email: '', password: '' });
      setIsLoading(false);
      enqueueSnackbar("Logged in successfully!", { variant: 'success' })
      navigate('/');
    } catch (error) {
      setIsLoading(false);
      const errorMessage = "Login failed.  Try again later.";
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  };

  useEffect(() => {
    //if already loggedin
    if (localStorage.getItem('accessToken')) {
      navigate('/comments');
    }
  }, []);


  return (
    <div className="login-section page-container">
      <div className="login-form card">
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>

          <div className="form-group">
            <label htmlFor="email">Email*</label>
            <input
              className='form-control'
              type="email"
              name="email"
              id="email"
              value={userEntry.email}
              onChange={handleChange}
              placeholder='Enter your email'
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password*</label>
            <input
              className='form-control'
              type="password"
              name="password"
              id="password"
              value={userEntry.password}
              onChange={handleChange}
              placeholder='Enter password'
              minLength='8'
              required
            />
            <span className="helper-text">Minimum 8 characters</span>
          </div>

          <div className="action-container">
            {isLoading ?
              <button className="btn btn-primary" type="submit" disabled>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Login
              </button> :
              <button type="submit" className='btn btn-primary'>Login</button>}
            <Link to="/register">Have an account?</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
