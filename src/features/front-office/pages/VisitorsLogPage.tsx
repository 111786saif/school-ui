import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, FileText, Phone, Clock, User, Users, MoreHorizontal, Filter } from 'lucide-react';
import styles from './VisitorsLogPage.module.css';

// Standardized UI Components
import PageHeader from '../../../components/ui/PageHeader';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const VisitorsLogPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [purpose, setPurpose] = useState('');

  const purposeOptions = [
    { value: '', label: 'All Purposes' },
    { value: 'Interview', label: 'Interview' },
    { value: 'Parent Meet', label: 'Parent Meet' },
    { value: 'Admission', label: 'Admission' },
    { value: 'Vendor', label: 'Vendor' },
  ];

  const entriesOptions = [
    { value: '10', label: '10' },
    { value: '25', label: '25' },
    { value: '50', label: '50' },
  ];

  return (
    <div className={styles.pageContainer}>
      <PageHeader 
        title="Visitors Log" 
        breadcrumbs="Dashboard / Front Office / Visitors"
        actions={
          <Button 
            icon={<Plus size={18} />} 
            onClick={() => navigate('/front-office/visitors/add')}
          >
            Add Visitor
          </Button>
        }
      />

      <Card className={styles.mainCard}>
        {/* Modern Filter Section */}
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
             <Select 
              options={purposeOptions}
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className={styles.purposeSelect}
            />
            <Button variant="secondary" icon={<Filter size={16} />}>Filter</Button>
          </div>
        </div>

        {/* Table Controls */}
        <div className={styles.controlsRow}>
          <div className={styles.entriesControl}>
            <span>Show</span>
            <Select 
              options={entriesOptions} 
              className={styles.entriesSelect}
            />
            <span>entries</span>
          </div>
        </div>

        {/* Table */}
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Visitor Name</th>
                <th>Phone</th>
                <th>Purpose</th>
                <th>No. of Persons</th>
                <th>Date</th>
                <th>In Time</th>
                <th>Out Time</th>
                <th className={styles.actionColumn}>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* Placeholder Row to show design */}
               {/* <tr>
                <td>
                  <div className={styles.visitorInfo}>
                    <User size={16} className={styles.visitorIcon} />
                    <span>John Doe</span>
                  </div>
                </td>
                <td>9876543210</td>
                <td><span className={styles.purposeTag}>Parent Meet</span></td>
                <td>2</td>
                <td>Jan 18, 2026</td>
                <td className={styles.timeIn}>09:30 AM</td>
                <td className={styles.timeOut}>-</td>
                <td>
                  <Button variant="ghost" size="sm" icon={<MoreHorizontal size={16} />} />
                </td>
              </tr> */}
              <tr>
                <td colSpan={8} className={styles.noData}>
                  <div className={styles.noDataContent}>
                    <FileText size={48} className={styles.noDataIcon} />
                    <p>No visitor records found</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

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

export default VisitorsLogPage;