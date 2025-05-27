import { useState } from 'react';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ENDPOINT } from '../../App';
import './ResetPassword.css';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    email: '',
    newPassword: '',
    resetToken: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { newPassword, resetToken } = formData;
    if (!newPassword || !resetToken) {
      enqueueSnackbar('Fill all required fields.', { variant: 'warning' });
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(ENDPOINT + 'auth/reset-password', {
        newPassword,
        resetToken,
      });
      enqueueSnackbar(res.data.message || 'Password reset successful.', { variant: 'success' });
      navigate('/comments');
    } catch (err) {
      enqueueSnackbar('Failed to reset password.', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="reset-password-section page-container">
      <div className="reset-password-form card">
        <form onSubmit={handleSubmit}>
          <h1>Reset Password</h1>

          <div className="form-group">
            <label>New Password*</label>
            <input
              className="form-control"
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              placeholder="Enter new password"
              minLength="8"
              required
            />
          </div>

          <div className="form-group">
            <label>Reset Token*</label>
            <input
              className="form-control"
              type="text"
              name="resetToken"
              value={formData.resetToken}
              onChange={handleChange}
              placeholder="Enter reset token"
              required
            />
          </div>

          <div className="action-container">
            <button className="btn btn-primary" type="submit" disabled={isLoading}>
              {isLoading ? 'Resetting...' : 'Reset'}
            </button>
            <Link to="/forgot-password">Back to forgot password</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
