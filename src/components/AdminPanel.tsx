import { useState, useEffect } from 'react';
import { adminAPI, type AdminUser } from '../api/api';
import '../styles/AdminPanel.css';

const AdminPanel = () => {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const fetchedUsers = await adminAPI.getAllUsers();
      setUsers(fetchedUsers);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to fetch users');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (deleteConfirm !== userId) {
      setDeleteConfirm(userId);
      setTimeout(() => setDeleteConfirm(null), 3000);
      return;
    }

    try {
      await adminAPI.deleteUser(userId);
      setUsers(users.filter(u => u.id !== userId));
      setDeleteConfirm(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to delete user');
      }
    }
  };

  if (loading) {
    return (
      <div className="admin-panel">
        <div className="admin-loading">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <div>
          <h2>User Management</h2>
          <p className="admin-subtitle">Manage all registered users</p>
        </div>
        <button className="btn-refresh" onClick={fetchUsers}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path d="M21.5 2v6h-6M2.5 22v-6h6M2 11.5a10 10 0 0 1 18.8-4.3M22 12.5a10 10 0 0 1-18.8 4.2" />
          </svg>
          Refresh
        </button>
      </div>

      {error && (
        <div className="admin-error">
          {error}
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      <div className="admin-stats">
        <div className="admin-stat-card">
          <div className="admin-stat-value">{users.length}</div>
          <div className="admin-stat-label">Total Users</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">
            {users.filter(u => u.role === 'admin').length}
          </div>
          <div className="admin-stat-label">Admins</div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-value">
            {users.filter(u => u.role !== 'admin').length}
          </div>
          <div className="admin-stat-label">Regular Users</div>
        </div>
      </div>

      <div className="users-table">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="user-cell">
                    <div className="user-cell-avatar">
                      {user.username.charAt(0).toUpperCase()}
                    </div>
                    <span>{user.username}</span>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <span className={`role-badge ${user.role}`}>
                    {user.role}
                  </span>
                </td>
                <td>
                  {user.role !== 'admin' && (
                    <button
                      className={`btn-delete-user ${deleteConfirm === user.id ? 'confirm' : ''}`}
                      onClick={() => handleDeleteUser(user.id)}
                    >
                      {deleteConfirm === user.id ? 'Confirm?' : 'Delete'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminPanel;