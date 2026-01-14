import React, { useState } from 'react';
import { Bell, Search, User, Sun, Moon, Globe, LogOut, Settings, UserCircle, Menu } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import styles from './Header.module.css';

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  
  const [langOpen, setLangOpen] = useState<boolean>(false);
  const [profileOpen, setProfileOpen] = useState<boolean>(false);
  const [currentLang, setCurrentLang] = useState<string>('EN');

  const handleLangSelect = (lang: string) => {
    setCurrentLang(lang);
    setLangOpen(false);
  };

  const handleLogout = () => {
    logout();
    setProfileOpen(false);
  };

  return (
    <header className={styles.header}>
      {/* Mobile Menu Button */}
      <button className={styles.menuBtn} onClick={onMenuClick}>
        <Menu size={24} />
      </button>

      {/* Search Bar */}
      <div className={styles.searchBar}>
        <Search size={18} />
        <input type="text" placeholder="Search..." />
      </div>

      {/* Right Actions Area */}
      <div className={styles.actions}>
        
        {/* Language Selector */}
        <div className={styles.languageSelector}>
          <button 
            className={styles.iconBtn} 
            onClick={() => setLangOpen(!langOpen)}
            title="Select Language"
          >
            <Globe size={20} />
            <span style={{ fontSize: '12px', fontWeight: 'bold', marginLeft: '4px' }}>{currentLang}</span>
          </button>
          
          {langOpen && (
            <div className={styles.langDropdown}>
              <div className={styles.langOption} onClick={() => handleLangSelect('EN')}>🇺🇸 English</div>
              <div className={styles.langOption} onClick={() => handleLangSelect('ES')}>🇪🇸 Spanish</div>
              <div className={styles.langOption} onClick={() => handleLangSelect('FR')}>🇫🇷 French</div>
            </div>
          )}
        </div>

        {/* Theme Toggle */}
        <button className={styles.iconBtn} onClick={toggleTheme} title="Toggle Theme">
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notifications */}
        <button className={styles.iconBtn}>
          <Bell size={20} />
        </button>

        {/* User Profile */}
        <div className={styles.languageSelector} style={{ position: 'relative' }}>
          <div 
            className={styles.userProfile} 
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <div className={styles.avatar}>
              <User size={24} color="#4318ff" />
            </div>
          </div>

          {profileOpen && (
            <div className={styles.userDropdown}>
              <div className={styles.userDropdownHeader}>
                <span className={styles.userName}>{user?.name || 'Guest User'}</span>
                <span className={styles.userRole}>{user?.role || 'Visitor'}</span>
              </div>
              
              <div className={styles.menuItem}>
                <UserCircle size={16} />
                <span>My Profile</span>
              </div>
              
              <div className={styles.menuItem}>
                <Settings size={16} />
                <span>Settings</span>
              </div>
              
              <div 
                className={`${styles.menuItem} ${styles.logout}`} 
                onClick={handleLogout}
              >
                <LogOut size={16} />
                <span>Logout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;