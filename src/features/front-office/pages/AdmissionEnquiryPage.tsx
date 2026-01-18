import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, Filter, Phone, User, Calendar, Tag, MoreHorizontal, FileText, LayoutList } from 'lucide-react';
import styles from './AdmissionEnquiryPage.module.css';

// Standardized UI Components
import PageHeader from '../../../components/ui/PageHeader';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const AdmissionEnquiryPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('');
  const [source, setSource] = useState('');

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'Active', label: 'Active' },
    { value: 'Passive', label: 'Passive' },
    { value: 'Dead', label: 'Dead' },
    { value: 'Won', label: 'Won' },
    { value: 'Lost', label: 'Lost' },
  ];

  const sourceOptions = [
    { value: '', label: 'All Sources' },
    { value: 'Walk-in', label: 'Walk-in' },
    { value: 'Phone', label: 'Phone' },
    { value: 'Website', label: 'Website' },
    { value: 'Referral', label: 'Referral' },
  ];

  return (
    <div className={styles.pageContainer}>
      <PageHeader 
        title="Admission Enquiries" 
        breadcrumbs="Dashboard / Front Office / Enquiries"
        actions={
          <Button 
            icon={<Plus size={18} />} 
            onClick={() => navigate('/front-office/admission-enquiries/add')}
          >
            New Enquiry
          </Button>
        }
      />

      <Card className={styles.mainCard}>
        {/* Filter Section */}
        <div className={styles.filterSection}>
           <div className={styles.searchBox}>
              <Input 
                placeholder="Search by Name or Phone..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search size={18} className="text-gray-400" />}
              />
           </div>
           
           <div className={styles.filterControls}>
              <Input 
                 type="date" 
                 className={styles.dateInput}
              />
              <Select 
                options={sourceOptions}
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className={styles.filterSelect}
              />
              <Select 
                options={statusOptions}
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={styles.filterSelect}
              />
              <Button variant="secondary" icon={<Filter size={16} />}>Filter</Button>
           </div>
        </div>

        {/* Table Controls */}
        <div className={styles.controlsRow}>
          <div className={styles.entriesControl}>
            <span>Show</span>
            <Select 
              options={[{value:'10', label:'10'}, {value:'25', label:'25'}, {value:'50', label:'50'}]} 
              className={styles.entriesSelect}
            />
            <span>entries</span>
          </div>
          <div className={styles.viewControls}>
            <Button variant="ghost" size="sm" icon={<LayoutList size={18} />} />
          </div>
        </div>

        {/* Table */}
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Source</th>
                <th>Enquiry Date</th>
                <th>Last Follow Up</th>
                <th>Next Follow Up</th>
                <th>Status</th>
                <th className={styles.actionColumn}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Placeholder Row */}
               {/* <tr>
                <td>
                    <div className={styles.personInfo}>
                        <span className={styles.personName}>Aravind Kumar</span>
                        <span className={styles.subText}>Class 1</span>
                    </div>
                </td>
                <td>9876543210</td>
                <td>Walk-in</td>
                <td>Jan 15, 2026</td>
                <td>Jan 16, 2026</td>
                <td>Jan 20, 2026</td>
                <td><span className={`${styles.statusBadge} ${styles.statusActive}`}>Active</span></td>
                <td>
                   <div className={styles.actions}>
                        <Button variant="ghost" size="sm" icon={<MoreHorizontal size={16}/>} />
                   </div>
                </td>
              </tr> */}
              <tr>
                <td colSpan={8} className={styles.noData}>
                  <div className={styles.noDataContent}>
                    <FileText size={48} className={styles.noDataIcon} />
                    <p>No admission enquiries found</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className={styles.pagination}>
          <span className={styles.pageInfo}>Showing 0 to 0 of 0 entries</span>
          <div className={styles.pageButtons}>
            <Button variant="ghost" size="sm" disabled>Previous</Button>
            <Button variant="ghost" size="sm" disabled>Next</Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default AdmissionEnquiryPage;