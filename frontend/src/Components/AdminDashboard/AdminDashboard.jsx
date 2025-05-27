import { useEffect, useState } from 'react';
import axios from 'axios';
import { ENDPOINT } from '../../App';
import { useSnackbar } from 'notistack';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userIdentifier, setUserIdentifier] = useState('');

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(ENDPOINT + 'users', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        });
        setUsers(res.data.users);
      } catch (err) {
        enqueueSnackbar('Failed to load users.', { variant: 'error' });
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handlePermissionChange = (userId, type) => {
    setUsers((prev) =>
      prev.map((user) => {
        if (user._id !== userId) return user;

        const hasPermission = user.permissions.includes(type);
        let updatedPermissions;

        if (hasPermission) {
          // Remove permission
          updatedPermissions = user.permissions.filter((perm) => perm !== type);
        } else {
          // Add permission
          updatedPermissions = [...user.permissions, type];
        }

        return { ...user, permissions: updatedPermissions };
      })
    );
  };


  const handleSave = async (userId) => {
    const user = users.find((u) => u._id === userId);
    try {
      await axios.put(ENDPOINT + `permissions`, { userId: userId, permissions: user.permissions },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      );
      enqueueSnackbar('Permissions updated!', { variant: 'success' });
    } catch (error) {
      const errorMessage = error.response.data.message || "Failed to update permissions";
      enqueueSnackbar(errorMessage, { variant: 'error' });
    }
  };

  const handlePromote = async () => {
    if (!userIdentifier) {
      enqueueSnackbar('Please provide a user email or ID.', { variant: 'warning' });
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.put(ENDPOINT + 'permissions/promote', { email: userIdentifier },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );
      enqueueSnackbar(res.data.message || 'User promoted to admin!', { variant: 'success' });
      setUserIdentifier('');
      setShowModal(false);
    } catch (error) {
      const errorMessage = error.response.data.message || "Failed to promote user.";
      enqueueSnackbar(errorMessage, { variant: 'error' });
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center my-3">
      <div className="spinner-border text-primary" role="status" />
    </div>;
  }

  return (
    <div className="container mt-4">
      <div className='d-flex justify-content-between mt-3'>
        <Link to="/comments">Back to Comments</Link>
        <button className='btn btn-success' data-toggle="modal" onClick={() => setShowModal(true)}>Prmote admin</button>
      </div>
      <h2>Admin Dashboard</h2>

      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Read</th>
            <th>Write</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>
                <input
                  type="checkbox"
                  checked={user.permissions.includes("read")}
                  onChange={() => handlePermissionChange(user._id, 'read')}
                />
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={user.permissions.includes("write")}
                  onChange={() => handlePermissionChange(user._id, 'write')}
                />
              </td>
              <td>
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => handleSave(user._id)}
                >
                  Save
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Make admin Modal */}
      {showModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Promote to admin</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="form-group">
                  <label htmlFor="userIdentifier">User Email or ID</label>
                  <input
                    type="text"
                    className="form-control"
                    id="userIdentifier"
                    placeholder="Enter user email or ID"
                    value={userIdentifier}
                    onChange={(e) => setUserIdentifier(e.target.value)}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-primary"
                  onClick={handlePromote}
                  disabled={isLoading}
                >
                  {isLoading ? 'Promoting...' : 'Promote'}
                </button>
                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
