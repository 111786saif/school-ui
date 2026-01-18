import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, User, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';
import styles from '../pages/LoginPage.module.css';

export const LoginForm: React.FC = () => {
  const [username, setUsername] = useState<string>('DEV0001');
  const [password, setPassword] = useState<string>('password123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const result = await login(username, password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.error || 'Login failed');
    }
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <div className={styles.errorMessage}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className={styles.formGroup}>
        <label className={styles.label}>Username or ID</label>
        <div className={styles.inputWrapper}>
          <User size={18} className={styles.inputIcon} />
          <input
            type="text"
            className={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Enter your username"
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.label}>Password</label>
        <div className={styles.inputWrapper}>
          <Lock size={18} className={styles.inputIcon} />
          <input
            type={showPassword ? "text" : "password"}
            className={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
          <div 
            className={styles.eyeIcon} 
            onClick={() => setShowPassword(!showPassword)}
            role="button"
            tabIndex={0}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <label className={styles.checkboxGroup}>
          <input type="checkbox" className={styles.checkbox} />
          <span className={styles.rememberText}>Remember me</span>
        </label>
        <a href="#" className={styles.forgotLink}>Forgot password?</a>
      </div>

      <button type="submit" className={styles.submitButton} disabled={isSubmitting}>
        {isSubmitting ? 'Signing in...' : 'Sign In'}
        {!isSubmitting && <ArrowRight size={18} />}
      </button>
    </form>
  );
};
