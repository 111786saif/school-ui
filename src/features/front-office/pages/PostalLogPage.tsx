import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  X, 
  Search, 
  Filter, 
  Mail, 
  Package, 
  FileText, 
  Upload, 
  Download, 
  ArrowUpRight, 
  ArrowDownLeft,
  Loader2,
  AlertCircle,
  Eye,
  Info,
  Calendar,
  User,
  Paperclip
} from 'lucide-react';
import styles from './PostalLogPage.module.css';

// Standardized UI Components
import PageHeader from '../../../components/ui/PageHeader';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { postalService, PostalRecord, CreatePostalRecordDto } from '../api/postalService';

const PostalLogPage: React.FC = () => {
  // Data State
  const [postalRecords, setPostalRecords] = useState<PostalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter & Pagination State
  const [searchTerm, setSearchTerm] = useState('');
  const [directionFilter, setDirectionFilter] = useState('');
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<PostalRecord | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState<CreatePostalRecordDto>({
    direction: 'RECEIVED',
    postalType: 'LETTER',
    referenceNumber: '',
    fromTitle: '',
    toTitle: '',
    courierName: '',
    date: new Date().toISOString().slice(0, 10),
    notes: '',
    remarks: '',
    attachmentUrl: ''
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // --- Effects ---
  useEffect(() => {
    fetchPostalRecords();
  }, [pagination.page, pagination.size]);

  // --- API Handlers ---
  const fetchPostalRecords = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await postalService.getAll({
        page: pagination.page,
        size: pagination.size,
        search: searchTerm || undefined, 
        direction: directionFilter || undefined
      });
      setPostalRecords(response.content);
      setPagination(prev => ({
        ...prev,
        totalElements: response.page.totalElements,
        totalPages: response.page.totalPages
      }));
    } catch (err) {
      console.error('Failed to fetch postal records:', err);
      setError('Failed to load postal records.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 0 }));
    fetchPostalRecords();
  };

  const handleViewClick = async (id: string) => {
    try {
      setModalLoading(true);
      setIsViewModalOpen(true);
      const data = await postalService.getById(id);
      setSelectedRecord(data);
    } catch (err) {
      console.error("Failed to fetch record details:", err);
      alert("Failed to load details.");
      setIsViewModalOpen(false);
    } finally {
      setModalLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      // Logic for file upload would typically happen here
      // const fileUrl = selectedFile ? await uploadFile(selectedFile) : '';
      
      const payload = {
        ...formData,
        // attachmentUrl: fileUrl // Use the uploaded URL
      };

      await postalService.create(payload);
      setIsModalOpen(false);
      resetForm();
      fetchPostalRecords();
    } catch (err) {
      console.error('Failed to create postal record:', err);
      alert('Failed to save record. Please try again.');
    } finally {
      setModalLoading(false);
    }
  };

  // --- Helpers ---
  const resetForm = () => {
    setFormData({
      direction: 'RECEIVED',
      postalType: 'LETTER',
      referenceNumber: '',
      fromTitle: '',
      toTitle: '',
      courierName: '',
      date: new Date().toISOString().slice(0, 10),
      notes: '',
      remarks: '',
      attachmentUrl: ''
    });
    setSelectedFile(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  // --- Options ---
  const directionOptions = [
    { value: '', label: 'All Directions' },
    { value: 'RECEIVED', label: 'Received' },
    { value: 'DISPATCHED', label: 'Dispatched' },
  ];

  const modalDirectionOptions = [
     { value: 'RECEIVED', label: 'Received' },
     { value: 'DISPATCHED', label: 'Dispatched' },
  ];

  const postalTypeOptions = [
      { value: 'LETTER', label: 'Letter' },
      { value: 'PARCEL', label: 'Parcel' },
      { value: 'COURIER', label: 'Courier' },
  ];

  const entriesOptions = [
    { value: '10', label: '10' },
    { value: '25', label: '25' },
    { value: '50', label: '50' },
  ];

  return (
    <div className={styles.pageContainer}>
      <PageHeader 
        title="Postal Dispatch/Receive" 
        breadcrumbs="Dashboard / Front Office / Postal"
        actions={
          <Button 
            icon={<Plus size={18} />} 
            onClick={() => { setIsModalOpen(true); resetForm(); }}
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
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
           </div>
           
           <div className={styles.filterControls}>
              <Select 
                options={directionOptions}
                value={directionFilter}
                onChange={(e) => setDirectionFilter(e.target.value)}
                className={styles.filterSelect}
              />
              <Button variant="secondary" icon={<Filter size={16} />} onClick={handleSearch}>Filter</Button>
           </div>
        </div>

        {/* Table Controls */}
        <div className={styles.controlsRow}>
          <div className={styles.entriesControl}>
            <span>Show</span>
            <Select 
              options={entriesOptions} 
              className={styles.entriesSelect}
              value={String(pagination.size)}
              onChange={(e) => setPagination(prev => ({ ...prev, size: Number(e.target.value), page: 0 }))}
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
              {loading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                      <Loader2 className="animate-spin" /> Loading records...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                      <AlertCircle size={32} />
                      <p>{error}</p>
                      <Button variant="secondary" size="sm" onClick={fetchPostalRecords}>Retry</Button>
                    </div>
                  </td>
                </tr>
              ) : postalRecords.length > 0 ? (
                postalRecords.map((record) => (
                  <tr key={record.id}>
                    <td>
                      <span className={styles.typeBadge}>
                        {record.postalType === 'LETTER' ? <Mail size={14}/> : <Package size={14}/>} 
                        {' ' + record.postalType}
                      </span>
                    </td>
                    <td className={styles.refText}>{record.referenceNumber}</td>
                    <td className={styles.titleText}>{record.direction === 'RECEIVED' ? record.fromTitle : record.toTitle}</td>
                    <td>
                        <span className={`${styles.statusBadge} ${record.direction === 'RECEIVED' ? styles.received : styles.dispatched}`}>
                            {record.direction === 'RECEIVED' ? <ArrowDownLeft size={14} /> : <ArrowUpRight size={14} />} 
                            {' ' + record.direction}
                        </span>
                    </td>
                    <td>{formatDate(record.date)}</td>
                    <td>
                        <div className={styles.actions}>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              icon={<Eye size={16}/>} 
                              onClick={() => handleViewClick(record.id)}
                            />
                            {record.attachmentUrl && (
                              <Button variant="ghost" size="sm" icon={<Download size={16}/>} />
                            )}
                        </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className={styles.noData}>
                    <div className={styles.noDataContent}>
                      <Package size={48} className={styles.noDataIcon} />
                      <p>No postal records found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className={styles.pagination}>
          <span className={styles.pageInfo}>
            Showing {postalRecords.length === 0 ? 0 : pagination.page * pagination.size + 1} to {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} of {pagination.totalElements} entries
          </span>
          <div className={styles.pageButtons}>
            <Button 
              variant="ghost" 
              size="sm" 
              disabled={pagination.page === 0 || loading}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
            >
              Previous
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              disabled={pagination.page >= pagination.totalPages - 1 || loading}
              onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
            >
              Next
            </Button>
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
                    label="Reference Number"
                    name="referenceNumber"
                    value={formData.referenceNumber}
                    onChange={handleChange}
                    placeholder="e.g. REF-001"
                    required
                  />
                </div>

                <div className={styles.formGrid}>
                  <Input
                    label="From Title"
                    name="fromTitle"
                    value={formData.fromTitle}
                    onChange={handleChange}
                    placeholder="Sender Name/Title"
                    required
                  />
                  <Input
                    label="To Title"
                    name="toTitle"
                    value={formData.toTitle}
                    onChange={handleChange}
                    placeholder="Receiver Name/Title"
                    required
                  />
                </div>

                <div className={styles.formGrid}>
                  <Input
                    label="Courier Name"
                    name="courierName"
                    value={formData.courierName}
                    onChange={handleChange}
                    placeholder="e.g. DHL, FedEx"
                    required
                  />
                  
                  <div className={styles.fileUploadGroup}>
                     <label className={styles.fieldLabel} style={{ display: 'block', marginBottom: '8px', fontSize: '14px', fontWeight: 500, color: '#1e293b' }}>
                        Attachment
                     </label>
                     <div className={styles.fileInputWrapper} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <label 
                          htmlFor="file-upload" 
                          className={styles.fileLabel} 
                          style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '8px', 
                            padding: '8px 16px', 
                            border: '1px solid #e0e5f2', 
                            borderRadius: '8px', 
                            cursor: 'pointer', 
                            fontSize: '14px', 
                            color: '#64748b', 
                            backgroundColor: '#fff' 
                          }}
                        >
                            <Upload size={16} /> 
                            {selectedFile ? 'Change File' : 'Choose File'}
                        </label>
                        <input 
                            id="file-upload" 
                            type="file" 
                            onChange={handleFileChange} 
                            style={{ display: 'none' }}
                        />
                        {selectedFile && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#2b3674' }}>
                            <Paperclip size={14} />
                            <span style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {selectedFile.name}
                            </span>
                            <button 
                              type="button" 
                              onClick={handleRemoveFile} 
                              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: '#ef4444' }}
                            >
                              <X size={14} />
                            </button>
                          </div>
                        )}
                     </div>
                  </div>
                </div>
                
                <div className={styles.formFull}>
                    <Input
                        label="Notes"
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        multiline
                        rows={2}
                        placeholder="Additional notes..."
                    />
                     <div style={{ marginTop: '16px' }}>
                      <Input
                          label="Remarks"
                          name="remarks"
                          value={formData.remarks}
                          onChange={handleChange}
                          multiline
                          rows={2}
                          placeholder="Remarks..."
                      />
                    </div>
                </div>

              </div>
              <div className={styles.modalFooter}>
                <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => setIsModalOpen(false)}
                    disabled={modalLoading}
                >
                    Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={modalLoading}
                  icon={modalLoading ? <Loader2 size={16} className="animate-spin" /> : undefined}
                >
                  Save Record
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {isViewModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleContainer}>
                <div className={styles.modalIconBox}>
                    <Info size={20} color="#556ee6" />
                </div>
                <h2 className={styles.modalTitle}>Postal Record Details</h2>
              </div>
              <button 
                className={styles.closeButton} 
                onClick={() => { setIsViewModalOpen(false); setSelectedRecord(null); }}
              >
                <X size={20} />
              </button>
            </div>
            
            <div className={styles.modalBody}>
              {modalLoading ? (
                <div style={{ textAlign: 'center', padding: '40px' }}>
                   <Loader2 className="animate-spin" size={32} style={{ margin: '0 auto' }} />
                   <p style={{ marginTop: '12px', color: '#64748b' }}>Loading details...</p>
                </div>
              ) : selectedRecord ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                   {/* Header Status Block */}
                   <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2b3674' }}>
                          {selectedRecord.postalType === 'LETTER' ? <Mail size={20}/> : <Package size={20}/>}
                        </div>
                        <div>
                          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#2b3674', margin: 0 }}>
                            {selectedRecord.referenceNumber}
                          </h3>
                          <p style={{ fontSize: '13px', color: '#64748b', margin: '2px 0 0' }}>{selectedRecord.postalType}</p>
                        </div>
                      </div>
                      <span className={`${styles.statusBadge} ${selectedRecord.direction === 'RECEIVED' ? styles.received : styles.dispatched}`}>
                          {selectedRecord.direction}
                      </span>
                   </div>

                   {/* Key Details Grid */}
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#a3aed0', textTransform: 'uppercase' }}>From</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2b3674', fontWeight: 500 }}>
                           <User size={14} /> {selectedRecord.fromTitle}
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#a3aed0', textTransform: 'uppercase' }}>To</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2b3674', fontWeight: 500 }}>
                           <User size={14} /> {selectedRecord.toTitle}
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#a3aed0', textTransform: 'uppercase' }}>Courier</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2b3674', fontWeight: 500 }}>
                           <Package size={14} /> {selectedRecord.courierName}
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#a3aed0', textTransform: 'uppercase' }}>Date</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2b3674', fontWeight: 500 }}>
                           <Calendar size={14} /> {formatDate(selectedRecord.date)}
                        </div>
                      </div>
                   </div>

                   {/* Notes Section */}
                   <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#2b3674', marginBottom: '8px', marginTop: 0 }}>Notes</h4>
                      <p style={{ margin: 0, fontSize: '14px', color: '#475569', lineHeight: 1.5 }}>
                        {selectedRecord.notes || 'No notes provided.'}
                      </p>
                   </div>

                   {/* Remarks Section */}
                   {selectedRecord.remarks && (
                      <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#fff7ed', border: '1px solid #ffedd5' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#c2410c', marginBottom: '8px', marginTop: 0 }}>Remarks</h4>
                        <p style={{ margin: 0, fontSize: '14px', color: '#9a3412', lineHeight: 1.5 }}>
                          {selectedRecord.remarks}
                        </p>
                      </div>
                   )}
                </div>
              ) : null}
            </div>

            <div className={styles.modalFooter}>
               <Button 
                  type="button" 
                  onClick={() => { setIsViewModalOpen(false); setSelectedRecord(null); }}
              >
                  Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostalLogPage;
