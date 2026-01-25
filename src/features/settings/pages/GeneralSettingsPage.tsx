import React from 'react';
import { Settings, Construction } from 'lucide-react';
import styles from './SettingsPage.module.css';
import PageHeader from '../../../components/ui/PageHeader';

const GeneralSettingsPage: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      <PageHeader 
        title="General Settings" 
        breadcrumbs="Dashboard / Settings / General" 
      />
      <div className={styles.contentCard}>
        <Settings size={64} className={styles.placeholderIcon} />
        <h2 className={styles.placeholderText}>General Application Settings</h2>
        <p style={{ color: '#a3aed0', marginTop: '8px' }}>Configure general school details and preferences.</p>
      </div>
    </div>
  );
};

export default GeneralSettingsPage;
