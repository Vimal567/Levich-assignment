import { useState } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ENDPOINT } from '../../App';
import './ForgotPassword.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [token, setToken] = useState('');
  const [showModal, setShowModal] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      enqueueSnackbar('Please enter your email.', { variant: 'warning' });
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(ENDPOINT + 'auth/forgot-password', { email });
      setToken(res.data.resetToken);
      setShowModal(true);
      enqueueSnackbar(res.data.message || 'Password reset initiated.', { variant: 'success' });
    } catch (err) {
      enqueueSnackbar('Failed to initiate password reset.', { variant: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyAndGo = () => {
    navigator.clipboard.writeText(token)
      .then(() => {
        enqueueSnackbar('Token copied to clipboard!', { variant: 'success' });
        navigate('/reset-password');
      })
      .catch(() => {
        enqueueSnackbar('Failed to copy token.', { variant: 'error' });
      });
  };

  return (
    <div className="forgot-password-section page-container">
      <div className="forgot-password-form card">
        <form onSubmit={handleSubmit}>
          <h1>Forgot Password</h1>
          <div className="form-group">
            <label>Email*</label>
            <input
              className="form-control"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>
          <button className="btn btn-primary" type="submit" disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Request Reset Token'}
          </button>
        </form>
      </div>

      {/* Token Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Reset Token</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <p>Here’s your reset token (copy it safely):</p>
                <code className="d-block p-2 bg-light">{token}</code>
              </div>
              <div className="modal-footer">
                <button className="btn btn-primary" onClick={handleCopyAndGo}>
                  Copy & Go to Reset Page
                </button>
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ForgotPassword;
