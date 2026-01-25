import React from 'react';
import { Home, Construction } from 'lucide-react';
import styles from './SettingsPage.module.css';
import PageHeader from '../../../components/ui/PageHeader';

const HouseSettingsPage: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      <PageHeader 
        title="House Settings" 
        breadcrumbs="Dashboard / Settings / House" 
      />
      <div className={styles.contentCard}>
        <Home size={64} className={styles.placeholderIcon} />
        <h2 className={styles.placeholderText}>House Management Module</h2>
        <p style={{ color: '#a3aed0', marginTop: '8px' }}>Manage school houses and groups here.</p>
      </div>
    </div>
  );
};

export default HouseSettingsPage;
