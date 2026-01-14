import React from 'react';
import styles from '../pages/LoginPage.module.css';

interface LoginHeaderProps {
  title?: string;
  subtitle?: string;
}

export const LoginHeader: React.FC<LoginHeaderProps> = ({ 
  title = "Welcome", 
  subtitle = "Please enter your details to sign in" 
}) => {
  return (
    <>
      <div className={styles.logoSection}>
        <div className={styles.logoIcon}>
          <div className={styles.logoInner}></div>
        </div>
        <span className={styles.logoText}>MySchool</span>
      </div>

      <div className={styles.headerContent}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>
      </div>
    </>
  );
};
