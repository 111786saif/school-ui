import React, { useState } from 'react';
import { Plus, X, Search, Phone, PhoneIncoming, PhoneOutgoing, Calendar, Clock, User, Filter, MoreHorizontal, FileText } from 'lucide-react';
import styles from './PhoneCallLogPage.module.css';

// Standardized UI Components
import PageHeader from '../../../components/ui/PageHeader';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const PhoneCallLogPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [callTypeFilter, setCallTypeFilter] = useState('');
  
  const [formData, setFormData] = useState({
    callerName: '',
    phoneNumber: '',
    direction: 'Incoming',
    date: new Date().toISOString().slice(0, 10),
    nextFollowUpDate: '',
    callType: '',
    purpose: '',
    duration: '',
    note: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Phone Log Saved:', formData);
    setIsModalOpen(false);
    // Reset form or handle success
  };

  const callTypeOptions = [
    { value: '', label: 'All Call Types' },
    { value: 'Inquiry', label: 'Inquiry' },
    { value: 'Complaint', label: 'Complaint' },
    { value: 'Follow-up', label: 'Follow-up' },
    { value: 'General', label: 'General' },
  ];

  const entriesOptions = [
    { value: '10', label: '10' },
    { value: '25', label: '25' },
    { value: '50', label: '50' },
  ];

  return (
    <div className={styles.pageContainer}>
      <PageHeader 
        title="Phone Call Log" 
        breadcrumbs="Dashboard / Front Office / Phone Call Log"
        actions={
          <Button 
            icon={<Plus size={18} />} 
            onClick={() => setIsModalOpen(true)}
          >
            Log Call
          </Button>
        }
      />

      <Card className={styles.mainCard}>
        {/* Filter Section */}
        <div className={styles.filterSection}>
          <div className={styles.searchBox}>
            <Input 
              placeholder="Search Name or Phone..." 
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
              options={callTypeOptions}
              value={callTypeFilter}
              onChange={(e) => setCallTypeFilter(e.target.value)}
              className={styles.typeSelect}
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
                <th>Name</th>
                <th>Phone</th>
                <th>Date</th>
                <th>Next Follow Up</th>
                <th>Call Type</th>
                <th>Description</th>
                <th className={styles.actionColumn}>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* Placeholder for no data */}
              <tr>
                <td colSpan={7} className={styles.noData}>
                  <div className={styles.noDataContent}>
                    <Phone size={48} className={styles.noDataIcon} />
                    <p>No call logs found</p>
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

      {/* Log Call Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleContainer}>
                <div className={styles.modalIconBox}>
                    <Phone size={20} color="#556ee6" />
                </div>
                <h2 className={styles.modalTitle}>Log Phone Call</h2>
              </div>
              <button className={styles.closeButton} onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className={styles.modalForm}>
              <div className={styles.modalBody}>
                <div className={styles.formGrid}>
                    <Input
                        label="Name"
                        name="callerName"
                        value={formData.callerName}
                        onChange={handleChange}
                        placeholder="Caller Name"
                        icon={<User size={16} />}
                    />
                    <Input
                        label="Phone"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        required
                        placeholder="Phone Number"
                        type="tel"
                        icon={<Phone size={16} />}
                    />
                </div>

                <div className={styles.formGrid}>
                    <Input
                        label="Date"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                    <Input
                        label="Next Follow Up Date"
                        name="nextFollowUpDate"
                        type="date"
                        value={formData.nextFollowUpDate}
                        onChange={handleChange}
                    />
                </div>

                <div className={styles.formGrid}>
                    <Select
                        label="Call Duration"
                        name="duration"
                        options={[
                            {value: '', label: 'Select Duration', disabled: true},
                            {value: '0-5 min', label: '0-5 min'},
                            {value: '5-10 min', label: '5-10 min'},
                            {value: '10+ min', label: '10+ min'},
                        ]}
                        value={formData.duration}
                        onChange={handleChange}
                    />
                     <Select
                        label="Call Type"
                        name="callType"
                        options={[
                            {value: '', label: 'Select Type', disabled: true},
                            {value: 'Incoming', label: 'Incoming'},
                            {value: 'Outgoing', label: 'Outgoing'},
                        ]}
                        value={formData.callType}
                        onChange={handleChange}
                        required
                    />
                </div>
                
                <div className={styles.formFull}>
                    <Input
                        label="Description / Note"
                        name="note"
                        value={formData.note}
                        onChange={handleChange}
                        multiline
                        rows={3}
                        placeholder="Enter call details..."
                    />
                </div>
              </div>

              <div className={styles.modalFooter}>
                <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => setIsModalOpen(false)}
                >
                    Cancel
                </Button>
                <Button type="submit">Save Log</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhoneCallLogPage;
