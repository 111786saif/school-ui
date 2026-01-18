import React, { useState } from 'react';
import { Plus, X, Search, Filter, AlertCircle, FileText, User, MoreHorizontal, LayoutList } from 'lucide-react';
import styles from './ComplaintsPage.module.css';

// Standardized UI Components
import PageHeader from '../../../components/ui/PageHeader';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const ComplaintsPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');

  const [formData, setFormData] = useState({
    complainantName: '',
    type: 'Parent',
    category: '',
    date: new Date().toISOString().slice(0, 10),
    description: '',
    actionTaken: '',
    assignedTo: '',
    note: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Complaint Filed:', formData);
    setIsModalOpen(false);
  };

  const typeOptions = [
     { value: '', label: 'Select Type', disabled: true },
     { value: 'Parent', label: 'Parent' },
     { value: 'Student', label: 'Student' },
     { value: 'Staff', label: 'Staff' },
     { value: 'Other', label: 'Other' },
  ];

  const categoryOptions = [
    { value: '', label: 'Select Category', disabled: true },
    { value: 'Academic', label: 'Academic' },
    { value: 'Discipline', label: 'Discipline' },
    { value: 'Infrastructure', label: 'Infrastructure' },
    { value: 'Transport', label: 'Transport' },
    { value: 'Other', label: 'Other' },
  ];

  return (
    <div className={styles.pageContainer}>
      <PageHeader 
        title="Complaints" 
        breadcrumbs="Dashboard / Front Office / Complaints"
        actions={
          <Button 
            icon={<Plus size={18} />} 
            onClick={() => setIsModalOpen(true)}
          >
            File Complaint
          </Button>
        }
      />

      <Card className={styles.mainCard}>
        {/* Filter Section */}
        <div className={styles.filterSection}>
           <div className={styles.searchBox}>
              <Input 
                placeholder="Search Complainant or Ref No..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search size={18} className="text-gray-400" />}
              />
           </div>
           
           <div className={styles.filterControls}>
              <Select 
                options={[{value:'', label:'All Types'}, ...typeOptions.slice(1)]}
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value)}
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
                <th>Reference No</th>
                <th>Complainant</th>
                <th>Type</th>
                <th>Category</th>
                <th>Date</th>
                <th>Status</th>
                <th className={styles.actionColumn}>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* Placeholder Row */}
               {/* <tr>
                <td className={styles.refText}>CMP-2023-001</td>
                <td>
                    <div className={styles.personInfo}>
                        <span className={styles.personName}>Mr. Sharma</span>
                        <span className={styles.subText}>9876543210</span>
                    </div>
                </td>
                <td>Parent</td>
                <td><span className={styles.categoryBadge}>Academic</span></td>
                <td>Jan 15, 2026</td>
                <td><span className={`${styles.statusBadge} ${styles.statusPending}`}>Pending</span></td>
                <td>
                   <div className={styles.actions}>
                        <Button variant="ghost" size="sm" icon={<MoreHorizontal size={16}/>} />
                   </div>
                </td>
              </tr> */}
              <tr>
                <td colSpan={7} className={styles.noData}>
                  <div className={styles.noDataContent}>
                    <AlertCircle size={48} className={styles.noDataIcon} />
                    <p>No complaints found</p>
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

      {/* File Complaint Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleContainer}>
                <div className={styles.modalIconBox}>
                    <AlertCircle size={20} color="#ef4444" />
                </div>
                <h2 className={styles.modalTitle}>File Complaint</h2>
              </div>
              <button className={styles.closeButton} onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className={styles.modalForm}>
              <div className={styles.modalBody}>
                <div className={styles.formGrid}>
                   <Input 
                        label="Complainant Name"
                        name="complainantName"
                        value={formData.complainantName}
                        onChange={handleChange}
                        required
                        icon={<User size={16} />}
                        placeholder="Name of person"
                    />
                    <Select 
                        label="Complaint Type"
                        name="type"
                        options={typeOptions}
                        value={formData.type}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.formGrid}>
                    <Select 
                        label="Category"
                        name="category"
                        options={categoryOptions}
                        value={formData.category}
                        onChange={handleChange}
                    />
                    <Input 
                        label="Date"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={styles.formFull}>
                    <Input 
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        multiline
                        rows={3}
                        required
                        placeholder="Details of the complaint..."
                    />
                </div>

                 <div className={styles.formFull}>
                    <Input 
                        label="Action Taken"
                        name="actionTaken"
                        value={formData.actionTaken}
                        onChange={handleChange}
                        placeholder="Any immediate action taken..."
                    />
                </div>
                 
                 <div className={styles.formGrid}>
                     <Input 
                        label="Assigned To"
                        name="assignedTo"
                        value={formData.assignedTo}
                        onChange={handleChange}
                        placeholder="Staff Name"
                    />
                     <Input 
                        label="Note"
                        name="note"
                        value={formData.note}
                        onChange={handleChange}
                        placeholder="Internal notes..."
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
                <Button type="submit" variant="danger">File Complaint</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintsPage;
