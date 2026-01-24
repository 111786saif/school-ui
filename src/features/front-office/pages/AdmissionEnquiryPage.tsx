import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  LayoutList, 
  Eye, 
  Phone, 
  MoreHorizontal, 
  FileText,
  Users,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import styles from './AdmissionEnquiryPage.module.css';

// Standardized UI Components
import PageHeader from '../../../components/ui/PageHeader';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

// Mock Data Type
interface Enquiry {
  id: string;
  name: string;
  class: string;
  phone: string;
  source: string;
  enquiryDate: string;
  lastFollowUp: string;
  nextFollowUp: string;
  status: 'Active' | 'Won' | 'Lost' | 'Passive' | 'Dead';
}

const MOCK_DATA: Enquiry[] = [
  {
    id: '1',
    name: 'Aravind Kumar',
    class: 'Class 1',
    phone: '9876543210',
    source: 'Walk-in',
    enquiryDate: '2026-01-15',
    lastFollowUp: '2026-01-16',
    nextFollowUp: '2026-01-24',
    status: 'Active'
  },
  {
    id: '2',
    name: 'Sarah Smith',
    class: 'Kindergarten',
    phone: '9876541234',
    source: 'Website',
    enquiryDate: '2026-01-10',
    lastFollowUp: '2026-01-12',
    nextFollowUp: '2026-01-25',
    status: 'Won'
  },
  {
    id: '3',
    name: 'Rahul Jones',
    class: 'Class 5',
    phone: '9988776655',
    source: 'Referral',
    enquiryDate: '2025-12-20',
    lastFollowUp: '2025-12-25',
    nextFollowUp: '',
    status: 'Lost'
  },
  {
    id: '4',
    name: 'Emily Davis',
    class: 'Class 3',
    phone: '8877665544',
    source: 'Phone',
    enquiryDate: '2026-01-18',
    lastFollowUp: '2026-01-20',
    nextFollowUp: '2026-01-26',
    status: 'Active'
  }
];

const AdmissionEnquiryPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('');
  const [source, setSource] = useState('');
  
  // Stats for the summary section
  const stats = {
    total: MOCK_DATA.length,
    active: MOCK_DATA.filter(d => d.status === 'Active').length,
    won: MOCK_DATA.filter(d => d.status === 'Won').length,
    todayFollowUp: MOCK_DATA.filter(d => d.nextFollowUp === '2026-01-24').length // Mock "today" check
  };

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

  // Formatting date to be more readable
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric'
    });
  };

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

      {/* Summary Stats */}
      <div className={styles.summarySection}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryIconBox} style={{ backgroundColor: '#e0e7ff', color: '#4338ca' }}>
            <Users size={24} />
          </div>
          <div className={styles.summaryContent}>
            <span className={styles.summaryLabel}>Total Enquiries</span>
            <span className={styles.summaryValue}>{stats.total}</span>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryIconBox} style={{ backgroundColor: '#dcfce7', color: '#166534' }}>
            <CheckCircle size={24} />
          </div>
          <div className={styles.summaryContent}>
            <span className={styles.summaryLabel}>Won / Admitted</span>
            <span className={styles.summaryValue}>{stats.won}</span>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryIconBox} style={{ backgroundColor: '#fff7ed', color: '#c2410c' }}>
             <Clock size={24} />
          </div>
          <div className={styles.summaryContent}>
            <span className={styles.summaryLabel}>Follow-up Today</span>
            <span className={styles.summaryValue}>{stats.todayFollowUp}</span>
          </div>
        </div>
      </div>

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
              {MOCK_DATA.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className={styles.personInfo}>
                      <span className={styles.personName}>{item.name}</span>
                      <span className={styles.subText}>{item.class}</span>
                    </div>
                  </td>
                  <td>{item.phone}</td>
                  <td><span className={styles.sourceTag}>{item.source}</span></td>
                  <td>{formatDate(item.enquiryDate)}</td>
                  <td>{formatDate(item.lastFollowUp)}</td>
                  <td>
                    <span className={item.nextFollowUp === '2026-01-24' ? styles.urgentDate : ''}>
                        {formatDate(item.nextFollowUp)}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.statusBadge} ${styles[`status${item.status}`]}`}>
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <div className={styles.actions}>
                      <button className={`${styles.actionBtn} ${styles.primary}`} title="View Details">
                         <Eye size={18} />
                      </button>
                      <button className={styles.actionBtn} title="Log Call">
                         <Phone size={18} />
                      </button>
                      <button className={styles.actionBtn} title="More Options">
                         <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {MOCK_DATA.length === 0 && (
                <tr>
                  <td colSpan={8} className={styles.noData}>
                    <div className={styles.noDataContent}>
                      <FileText size={48} className={styles.noDataIcon} />
                      <p>No admission enquiries found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className={styles.pagination}>
          <span className={styles.pageInfo}>Showing 1 to {MOCK_DATA.length} of {MOCK_DATA.length} entries</span>
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
