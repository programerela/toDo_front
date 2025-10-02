import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import { useNavigate } from 'react-router-dom';
import '../styles/Header.css';

const Header = () => {
  const { user, logout, deleteAccount } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setShowDeleteConfirm(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    try {
      await deleteAccount();
      navigate('/login');
    } catch (error) {
      console.error('Failed to delete account:', error);
    }
  };

  // Check if user is admin (you can adjust this based on how roles are stored)
  const isAdmin = user?.role === 'admin' || user?.email?.includes('admin');

  return (
    <header className="header">
      <div className="header-container">
        <div className="header-logo">
          <img
            src="../../public/icon.png"
            alt="toDo Logo"
            className="logo-icon"
          />
          <span className="logo-text">toDo</span>
        </div>

        <div className="header-right">
          <div className="profile-dropdown" ref={dropdownRef}>
            <button
              className="profile-button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <div className="user-avatar">
                {user?.username.charAt(0).toUpperCase()}
              </div>
              <span className="user-name">{user?.username}</span>
              <svg
                className={`dropdown-arrow ${isDropdownOpen ? 'open' : ''}`}
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="dropdown-menu">
                <button className="dropdown-item" onClick={handleLogout}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                    <polyline points="16 17 21 12 16 7" />
                    <line x1="21" y1="12" x2="9" y2="12" />
                  </svg>
                  Logout
                </button>
                
                {!isAdmin && (
                  <button
                    className={`dropdown-item delete ${showDeleteConfirm ? 'confirm' : ''}`}
                    onClick={handleDeleteAccount}
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                    {showDeleteConfirm ? 'Confirm Delete?' : 'Delete Account'}
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;