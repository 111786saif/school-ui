import React from 'react';
import { LoginHeader } from '../components/LoginHeader';
import { LoginForm } from '../components/LoginForm';
import { LoginFooter } from '../components/LoginFooter';
import styles from './LoginPage.module.css';

const LoginPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <LoginHeader 
        title="Welcome" 
        subtitle="Please enter your details to sign in" 
      />

      <div className={styles.loginCard}>
        <LoginForm />
      </div>

      <LoginFooter />
    </div>
  );
};

export default LoginPage;