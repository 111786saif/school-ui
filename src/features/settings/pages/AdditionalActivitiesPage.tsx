import React from 'react';
import { Activity, Construction } from 'lucide-react';
import styles from './SettingsPage.module.css';
import PageHeader from '../../../components/ui/PageHeader';

const AdditionalActivitiesPage: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      <PageHeader 
        title="Additional Activities" 
        breadcrumbs="Dashboard / Settings / Activities" 
      />
      <div className={styles.contentCard}>
        <Activity size={64} className={styles.placeholderIcon} />
        <h2 className={styles.placeholderText}>Additional Activities Module</h2>
        <p style={{ color: '#a3aed0', marginTop: '8px' }}>Manage extra-curricular activities here.</p>
      </div>
    </div>
  );
};

export default AdditionalActivitiesPage;
