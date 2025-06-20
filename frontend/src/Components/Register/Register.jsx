import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { ENDPOINT } from '../../App';

const Register = () => {

  const [userEntry, setUserEntry] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
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

    const { name, email, password } = userEntry;

    // Check if all required fields are filled
    if (!name || !email || !password) {
      enqueueSnackbar("Fill all the required fields!", { variant: 'warning' });
      return;
    }

    // Check if passwords match
    if (password !== userEntry.confirmPassword) {
      enqueueSnackbar("Password is not matching", { variant: 'warning' })
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await axios.post(ENDPOINT + 'auth/register', {
        name,
        email,
        password
      });

      const { data, accessToken, refreshToken } = response.data;

      // Save account data and tokens in localStorage
      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);

      // Clear the form and navigate to omments page
      setUserEntry({ name: '', email: '', password: '', confirmPassword: '' });
      setIsLoading(false);
      enqueueSnackbar("Registered successfully!", { variant: 'success' })
      navigate('/comments');
    } catch (error) {
      setIsLoading(false);
      const errorMessage = error.response?.data?.message || "Registration failed";
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
    <div className="register-section page-container">
      <div className="register-form card">
        <form onSubmit={handleSubmit}>
          <h1>Register</h1>

          <div className="form-group">
            <label htmlFor="name">Name*</label>
            <input
              className='form-control'
              type="text"
              name="name"
              id="name"
              value={userEntry.name}
              onChange={handleChange}
              placeholder='Enter your name'
              required
              minLength='3'
            />
          </div>

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

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm password*</label>
            <input
              className='form-control'
              type="password"
              name="confirmPassword"
              id="confirmPassword"
              value={userEntry.confirmPassword}
              onChange={handleChange}
              placeholder='Enter password again'
              minLength='8'
              required
            />
          </div>

          <div className="action-container">
            {isLoading ?
              <button className="btn btn-primary" type="submit" disabled>
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Register
              </button> :
              <button type="submit" className='btn btn-primary'>Register</button>}
            <Link to="/login">Have an account?</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
