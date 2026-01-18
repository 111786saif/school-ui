import React, { useState } from 'react';
import { Plus, X, Search, Filter, Mail, Package, FileText, Upload, Download, ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import styles from './PostalLogPage.module.css';

// Standardized UI Components
import PageHeader from '../../../components/ui/PageHeader';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const PostalLogPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [directionFilter, setDirectionFilter] = useState('');
  
  const [formData, setFormData] = useState({
    direction: 'Received',
    date: new Date().toISOString().slice(0, 10),
    postalType: '',
    fromTitle: '',
    toTitle: '',
    referenceNo: '',
    courierName: '',
    note: '',
    attachment: null as File | null,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, attachment: e.target.files![0] }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Postal Record Saved:', formData);
    setIsModalOpen(false);
  };

  const directionOptions = [
    { value: '', label: 'All Directions' },
    { value: 'Dispatch', label: 'Dispatch' },
    { value: 'Receive', label: 'Receive' },
  ];

  const modalDirectionOptions = [
     { value: 'Received', label: 'Received' },
     { value: 'Dispatch', label: 'Dispatch' },
  ];

  const postalTypeOptions = [
      { value: '', label: 'Select Type', disabled: true },
      { value: 'Letter', label: 'Letter' },
      { value: 'Parcel', label: 'Parcel' },
      { value: 'Document', label: 'Document' },
      { value: 'Other', label: 'Other' },
  ];

  return (
    <div className={styles.pageContainer}>
      <PageHeader 
        title="Postal Dispatch/Receive" 
        breadcrumbs="Dashboard / Front Office / Postal"
        actions={
          <Button 
            icon={<Plus size={18} />} 
            onClick={() => setIsModalOpen(true)}
          >
            New Postal
          </Button>
        }
      />

      <Card className={styles.mainCard}>
        {/* Filter Section */}
        <div className={styles.filterSection}>
           <div className={styles.searchBox}>
              <Input 
                placeholder="Search by Title or Ref No..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search size={18} className="text-gray-400" />}
              />
           </div>
           
           <div className={styles.filterControls}>
              <Select 
                options={directionOptions}
                value={directionFilter}
                onChange={(e) => setDirectionFilter(e.target.value)}
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
        </div>

        {/* Table */}
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Type</th>
                <th>Reference No</th>
                <th>Title</th>
                <th>Direction</th>
                <th>Date</th>
                <th className={styles.actionColumn}>Actions</th>
              </tr>
            </thead>
            <tbody>
               {/* Placeholder Row */}
               {/* <tr>
                 <td><span className={styles.typeBadge}><Mail size={14}/> Letter</span></td>
                 <td className={styles.refText}>REF-2023-001</td>
                 <td className={styles.titleText}>Admission Application</td>
                 <td>
                    <span className={`${styles.statusBadge} ${styles.received}`}>
                        <ArrowDownLeft size={14} /> Received
                    </span>
                 </td>
                 <td>Jan 18, 2026</td>
                 <td>
                    <div className={styles.actions}>
                        <Button variant="ghost" size="sm" icon={<Download size={16}/>} />
                    </div>
                 </td>
               </tr> */}
              <tr>
                <td colSpan={6} className={styles.noData}>
                  <div className={styles.noDataContent}>
                    <Package size={48} className={styles.noDataIcon} />
                    <p>No postal records found</p>
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

      {/* Add Postal Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleContainer}>
                <div className={styles.modalIconBox}>
                    <Mail size={20} color="#556ee6" />
                </div>
                <h2 className={styles.modalTitle}>Add Postal Record</h2>
              </div>
              <button className={styles.closeButton} onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className={styles.modalForm}>
              <div className={styles.modalBody}>
                <div className={styles.formGrid}>
                  <Select
                    label="Direction"
                    name="direction"
                    options={modalDirectionOptions}
                    value={formData.direction}
                    onChange={handleChange}
                    required
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

                <div className={styles.formGrid}>
                  <Select
                    label="Postal Type"
                    name="postalType"
                    options={postalTypeOptions}
                    value={formData.postalType}
                    onChange={handleChange}
                    required
                  />
                  <Input
                    label="Reference No"
                    name="referenceNo"
                    value={formData.referenceNo}
                    onChange={handleChange}
                    placeholder="e.g. REF-001"
                  />
                </div>

                <div className={styles.formGrid}>
                  <Input
                    label="From Title"
                    name="fromTitle"
                    value={formData.fromTitle}
                    onChange={handleChange}
                    placeholder="Sender Name/Title"
                  />
                  <Input
                    label="To Title"
                    name="toTitle"
                    value={formData.toTitle}
                    onChange={handleChange}
                    placeholder="Receiver Name/Title"
                  />
                </div>

                <div className={styles.formGrid}>
                  <Input
                    label="Courier Name"
                    name="courierName"
                    value={formData.courierName}
                    onChange={handleChange}
                    placeholder="e.g. DHL, FedEx"
                  />
                  <div className={styles.fileUploadGroup}>
                     <label className={styles.fieldLabel}>Attachment</label>
                     <div className={styles.fileInputWrapper}>
                        <label htmlFor="file-upload" className={styles.fileLabel}>
                            <Upload size={16} /> Choose File
                        </label>
                        <input 
                            id="file-upload" 
                            type="file" 
                            onChange={handleFileChange} 
                            className={styles.hiddenInput} 
                        />
                        <span className={styles.fileName}>
                            {formData.attachment ? formData.attachment.name : 'No file chosen'}
                        </span>
                     </div>
                  </div>
                </div>
                
                <div className={styles.formFull}>
                    <Input
                        label="Note"
                        name="note"
                        value={formData.note}
                        onChange={handleChange}
                        multiline
                        rows={2}
                        placeholder="Additional notes..."
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
                <Button type="submit">Save Record</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostalLogPage;
