import React from 'react';
import styles from '../pages/LoginPage.module.css';

export const LoginFooter: React.FC = () => {
  return (
    <footer className={styles.footer}>
      Copyright © {new Date().getFullYear()} - sfsoftware
    </footer>
  );
};
