
import { useEffect, useState } from 'react';
import axios from 'axios';
import { ENDPOINT } from '../../App';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';

const CommentsPage = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const accessToken = localStorage.getItem('accessToken');
  const currentUser = JSON.parse(localStorage.getItem('user'));

  const fetchComments = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(ENDPOINT + 'comments', {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setComments(res.data.comments);
    } catch (err) {
      enqueueSnackbar("Failed to load comments.", { variant: 'warning' });
      setError('Failed to load comments.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsLoading(true);
    try {
      await axios.post(ENDPOINT + 'comments', { text: newComment }, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      setNewComment('');
      fetchComments();
    } catch (err) {
      enqueueSnackbar("Failed to add comment..", { variant: 'warning' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    setIsLoading(true);
    try {
      await axios.delete(ENDPOINT + `comments/${commentId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });
      fetchComments();
    } catch (err) {
      enqueueSnackbar("Failed to delete comment.", { variant: 'warning' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (accessToken) {
      fetchComments();
    } else {
      navigate('/login');
    }
  }, []);

  return (
    <div className="container page-container">
      <h2 className='pb-3'>Comments</h2>

      {isLoading && (
        <div className="text-center my-3">
          <div className="spinner-border text-primary" role="status" />
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {currentUser && currentUser.permissions.includes("write") && <form onSubmit={handleAddComment} className="mb-3">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">Post</button>
        </div>
      </form>}

      <ul className="list-group">
        {comments
          .filter((comment) => {
            const isOwner = comment.user._id === currentUser.id;
            const canReadAll = currentUser.permissions.includes('read');
            return canReadAll || isOwner;
          })
          .map((comment) => {
            const currentUserComment = comment.user._id === currentUser.id;

            return (
              <li
                key={comment._id}
                className="list-group-item d-flex justify-content-between align-items-center"
              >
                <div>
                  <strong>{comment.user.name || 'User'}:</strong> {comment.text}
                </div>
                {currentUserComment && (
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDeleteComment(comment._id)}
                  >
                    Delete
                  </button>
                )}
              </li>
            );
          })}
      </ul>


    </div>
  );
};

export default CommentsPage;
