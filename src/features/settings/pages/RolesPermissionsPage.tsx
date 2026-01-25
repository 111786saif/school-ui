import React from 'react';
import { Shield, Construction } from 'lucide-react';
import styles from './SettingsPage.module.css';
import PageHeader from '../../../components/ui/PageHeader';

const RolesPermissionsPage: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      <PageHeader 
        title="Roles & Permissions" 
        breadcrumbs="Dashboard / Settings / Roles & Permissions" 
      />
      <div className={styles.contentCard}>
        <Shield size={64} className={styles.placeholderIcon} />
        <h2 className={styles.placeholderText}>Roles & Permissions Management</h2>
        <p style={{ color: '#a3aed0', marginTop: '8px' }}>Manage user roles and access control lists.</p>
      </div>
    </div>
  );
};

export default RolesPermissionsPage;
