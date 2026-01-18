import React from 'react';
import { LoginForm } from '../components/LoginForm';
import { School, GraduationCap } from 'lucide-react';
import styles from './LoginPage.module.css';

const LoginPage: React.FC = () => {
  return (
    <div className={styles.pageWrapper}>
      {/* Left Side - Illustration */}
      <div className={styles.illustrationSection}>
        <div className={styles.illustrationContent}>
          {/* Placeholder for School Illustration SVG */}
          <div className={styles.illustrationImage}>
            <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="50" y="100" width="300" height="200" rx="20" fill="rgba(255,255,255,0.2)" />
              <rect x="80" y="130" width="240" height="140" rx="10" fill="rgba(255,255,255,0.3)" />
              <path d="M200 60L360 140H40L200 60Z" fill="rgba(255,255,255,0.4)" />
              <circle cx="200" cy="180" r="40" fill="rgba(255,255,255,0.5)" />
            </svg>
          </div>
          
          <h1 className={styles.illustrationTitle}>
            Digital Campus<br />Management System
          </h1>
          <p className={styles.illustrationText}>
            Streamline administrative tasks, enhance learning, and foster better communication in one unified platform.
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className={styles.formSection}>
        <div className={styles.loginContainer}>
          {/* Brand Logo */}
          <div className={styles.brandLogo}>
            <div className={styles.logoIcon}>
              <School size={24} />
            </div>
            <span className={styles.brandName}>MySchool</span>
          </div>

          <h2 className={styles.welcomeTitle}>Welcome Back! 👋</h2>
          <p className={styles.welcomeSubtitle}>
            Please sign in to access your dashboard.
          </p>

          <LoginForm />

          <div className={styles.footer}>
            © 2026 MySchool Inc. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;