import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  X, 
  Search, 
  Filter, 
  AlertCircle, 
  FileText, 
  User, 
  MoreHorizontal, 
  LayoutList,
  Loader2,
  Eye,
  CheckCircle,
  UserPlus,
  Check
} from 'lucide-react';
import styles from './ComplaintsPage.module.css';

// Standardized UI Components
import PageHeader from '../../../components/ui/PageHeader';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { complaintService, Complaint, CreateComplaintDto } from '../api/complaintService';

const ComplaintsPage: React.FC = () => {
  // Data State
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  });

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Form Data
  const [formData, setFormData] = useState<CreateComplaintDto>({
    complainantName: '',
    complaintType: 'PARENT',
    category: '',
    complaintDate: new Date().toISOString().slice(0, 10),
    description: '',
    internalNote: '',
    remarks: ''
  });
  
  const [resolveActionTaken, setResolveActionTaken] = useState('');

  // --- Effects ---
  useEffect(() => {
    fetchComplaints();
  }, [pagination.page, pagination.size]);

  // --- API Handlers ---
  const fetchComplaints = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await complaintService.getAll({
        page: pagination.page,
        size: pagination.size,
        search: searchTerm || undefined,
        complaintType: typeFilter || undefined,
        status: statusFilter || undefined,
        sort: 'createdAt,desc'
      });
      setComplaints(response.content);
      setPagination(prev => ({
        ...prev,
        totalElements: response.page.totalElements,
        totalPages: response.page.totalPages
      }));
    } catch (err) {
      console.error('Failed to fetch complaints:', err);
      setError('Failed to load complaints.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 0 }));
    fetchComplaints();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      await complaintService.create(formData);
      setIsModalOpen(false);
      resetForm();
      fetchComplaints();
    } catch (err) {
      console.error('Failed to create complaint:', err);
      alert('Failed to save complaint.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleViewClick = async (id: string) => {
    try {
      setModalLoading(true);
      setIsViewModalOpen(true);
      const data = await complaintService.getById(id);
      setSelectedComplaint(data);
    } catch (err) {
      console.error('Failed to fetch details:', err);
      alert('Failed to load details.');
      setIsViewModalOpen(false);
    } finally {
      setModalLoading(false);
    }
  };

  const handleResolveClick = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setResolveActionTaken('');
    setIsResolveModalOpen(true);
  };

  const handleResolveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplaint) return;

    setModalLoading(true);
    try {
      await complaintService.updateStatus(selectedComplaint.id, 'RESOLVED', resolveActionTaken);
      setIsResolveModalOpen(false);
      fetchComplaints();
      // If view modal is also open, refresh its data or close it
      if (isViewModalOpen) setIsViewModalOpen(false);
    } catch (err) {
      console.error('Failed to resolve complaint:', err);
      alert('Failed to update status.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleUpdateStatus = async (status: string) => {
    if (!selectedComplaint) return;
    try {
      // Direct status update without payload (e.g. re-opening)
      const updated = await complaintService.updateStatus(selectedComplaint.id, status);
      setSelectedComplaint(updated); 
      fetchComplaints();
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update status.');
    }
  };

  // --- Helpers ---
  const resetForm = () => {
    setFormData({
      complainantName: '',
      complaintType: 'PARENT',
      category: '',
      complaintDate: new Date().toISOString().slice(0, 10),
      description: '',
      internalNote: '',
      remarks: ''
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  // --- Options ---
  const typeOptions = [
     { value: '', label: 'All Types' },
     { value: 'PARENT', label: 'Parent' },
     { value: 'STUDENT', label: 'Student' },
     { value: 'STAFF', label: 'Staff' },
     { value: 'OTHER', label: 'Other' },
  ];

  const categoryOptions = [
    { value: '', label: 'Select Category', disabled: true },
    { value: 'Academic', label: 'Academic' },
    { value: 'Discipline', label: 'Discipline' },
    { value: 'Infrastructure', label: 'Infrastructure' },
    { value: 'Transport', label: 'Transport' },
    { value: 'Other', label: 'Other' },
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'OPEN', label: 'Open' },
    { value: 'IN_PROGRESS', label: 'In Progress' },
    { value: 'RESOLVED', label: 'Resolved' },
    { value: 'CLOSED', label: 'Closed' },
  ];

  const entriesOptions = [
    { value: '10', label: '10' },
    { value: '25', label: '25' },
    { value: '50', label: '50' },
  ];

  return (
    <div className={styles.pageContainer}>
      <PageHeader 
        title="Complaints" 
        breadcrumbs="Dashboard / Front Office / Complaints"
        actions={
          <Button 
            icon={<Plus size={18} />} 
            onClick={() => { setIsModalOpen(true); resetForm(); }}
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
                placeholder="Search Complainant..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                icon={<Search size={18} className="text-gray-400" />}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
           </div>
           
           <div className={styles.filterControls}>
              <Select 
                options={typeOptions}
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className={styles.filterSelect}
              />
              <Select 
                options={statusOptions}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
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
                <th>Complainant</th>
                <th>Type</th>
                <th>Category</th>
                <th>Date</th>
                <th>Status</th>
                <th>Assigned To</th>
                <th className={styles.actionColumn}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                      <Loader2 className="animate-spin" /> Loading...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                      <AlertCircle size={32} />
                      <p>{error}</p>
                      <Button variant="secondary" size="sm" onClick={fetchComplaints}>Retry</Button>
                    </div>
                  </td>
                </tr>
              ) : complaints.length > 0 ? (
                complaints.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className={styles.personInfo}>
                        <span className={styles.personName}>{item.complainantName}</span>
                      </div>
                    </td>
                    <td>{item.complaintType}</td>
                    <td><span className={styles.categoryBadge}>{item.category || '-'}</span></td>
                    <td>{formatDate(item.complaintDate)}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${
                        item.status === 'OPEN' ? styles.statusPending : 
                        item.status === 'RESOLVED' ? styles.statusWon : styles.statusActive
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td>{item.assignedToStaffName || '-'}</td>
                    <td>
                       <div className={styles.actions}>
                            {(item.status === 'OPEN' || item.status === 'IN_PROGRESS') && (
                              <button 
                                className={styles.btnResolve} // Using new class or inline style if module not updated yet
                                onClick={() => handleResolveClick(item)}
                                style={{ 
                                  backgroundColor: '#22c55e', 
                                  color: 'white', 
                                  border: 'none', 
                                  padding: '6px 12px', 
                                  borderRadius: '6px', 
                                  fontSize: '12px', 
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  marginRight: '8px'
                                }}
                              >
                                Resolve
                              </button>
                            )}
                            <button 
                              className={styles.actionBtn} 
                              onClick={() => handleViewClick(item.id)}
                              title="View Details"
                            >
                                <Eye size={18} />
                            </button>
                       </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className={styles.noData}>
                    <div className={styles.noDataContent}>
                      <AlertCircle size={48} className={styles.noDataIcon} />
                      <p>No complaints found</p>
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
             Showing {complaints.length === 0 ? 0 : pagination.page * pagination.size + 1} to {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} of {pagination.totalElements} entries
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
                        name="complaintType"
                        options={typeOptions.slice(1)} // Remove 'All Types'
                        value={formData.complaintType}
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
                        name="complaintDate"
                        type="date"
                        value={formData.complaintDate}
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
                 
                 <div className={styles.formGrid}>
                     <Input 
                        label="Internal Note"
                        name="internalNote"
                        value={formData.internalNote}
                        onChange={handleChange}
                        placeholder="Internal notes..."
                    />
                     <Input 
                        label="Remarks"
                        name="remarks"
                        value={formData.remarks}
                        onChange={handleChange}
                        placeholder="General remarks..."
                    />
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
                <Button type="submit" variant="danger" disabled={modalLoading}>
                  {modalLoading ? <Loader2 size={16} className="animate-spin" /> : 'File Complaint'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resolve Complaint Modal */}
      {isResolveModalOpen && selectedComplaint && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleContainer}>
                <div className={styles.modalIconBox} style={{ backgroundColor: '#dcfce7' }}>
                    <CheckCircle size={20} color="#16a34a" />
                </div>
                <h2 className={styles.modalTitle}>Resolve Complaint #{selectedComplaint.id.substring(0, 6)}</h2>
              </div>
              <button 
                className={styles.closeButton}
                onClick={() => setIsResolveModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleResolveSubmit} className={styles.modalForm}>
              <div className={styles.modalBody}>
                <div style={{ marginBottom: '16px' }}>
                  <label className={styles.summaryLabel}>Complaint By</label>
                  <div style={{ fontWeight: 600, color: '#2b3674' }}>{selectedComplaint.complainantName}</div>
                </div>
                <Input 
                    label="Action Taken *"
                    name="actionTaken"
                    value={resolveActionTaken}
                    onChange={(e) => setResolveActionTaken(e.target.value)}
                    multiline
                    rows={4}
                    required
                    placeholder="Describe how the complaint was resolved..."
                />
              </div>

              <div className={styles.modalFooter}>
                <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => setIsResolveModalOpen(false)}
                    disabled={modalLoading}
                >
                    Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={modalLoading}
                  style={{ backgroundColor: '#22c55e', borderColor: '#22c55e', color: 'white' }}
                >
                  {modalLoading ? <Loader2 size={16} className="animate-spin" /> : 'Mark Resolved'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {isViewModalOpen && selectedComplaint && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Complaint Details</h2>
              <button 
                className={styles.closeButton}
                onClick={() => setIsViewModalOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
            
            <div className={styles.modalBody}>
               {/* Status Bar */}
               <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', background: '#f8fafc', padding: '12px', borderRadius: '8px' }}>
                  <div style={{ fontWeight: 600 }}>Status: <span style={{ color: '#2563eb' }}>{selectedComplaint.status}</span></div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                     {selectedComplaint.status !== 'RESOLVED' && (
                        <Button 
                          size="sm" 
                          onClick={() => { setIsViewModalOpen(false); handleResolveClick(selectedComplaint); }} 
                          style={{ backgroundColor: '#22c55e', borderColor: '#22c55e', color: 'white' }}
                          icon={<CheckCircle size={14} />}
                        >
                          Resolve
                        </Button>
                     )}
                     <Button size="sm" variant="secondary" icon={<UserPlus size={14} />}>Assign</Button>
                  </div>
               </div>

               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label className={styles.summaryLabel}>Complainant</label>
                    <div style={{ fontWeight: 600 }}>{selectedComplaint.complainantName}</div>
                  </div>
                  <div>
                    <label className={styles.summaryLabel}>Type</label>
                    <div>{selectedComplaint.complaintType}</div>
                  </div>
                  <div>
                    <label className={styles.summaryLabel}>Category</label>
                    <div>{selectedComplaint.category || '-'}</div>
                  </div>
                  <div>
                    <label className={styles.summaryLabel}>Date</label>
                    <div>{formatDate(selectedComplaint.complaintDate)}</div>
                  </div>
                  <div>
                    <label className={styles.summaryLabel}>Assigned To</label>
                    <div>{selectedComplaint.assignedToStaffName || 'Unassigned'}</div>
                  </div>
               </div>
               
               <div style={{ marginTop: '16px' }}>
                  <label className={styles.summaryLabel}>Description</label>
                  <div style={{ padding: '12px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '8px', marginTop: '4px' }}>
                    {selectedComplaint.description || 'No description provided.'}
                  </div>
               </div>

               {selectedComplaint.actionTaken && (
                 <div style={{ marginTop: '16px' }}>
                    <label className={styles.summaryLabel}>Action Taken</label>
                    <div style={{ padding: '12px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', marginTop: '4px', color: '#166534' }}>
                      {selectedComplaint.actionTaken}
                    </div>
                 </div>
               )}

               {selectedComplaint.internalNote && (
                 <div style={{ marginTop: '16px' }}>
                    <label className={styles.summaryLabel}>Internal Note</label>
                    <div style={{ padding: '12px', background: '#fff7ed', borderRadius: '8px', marginTop: '4px', color: '#c2410c' }}>
                      {selectedComplaint.internalNote}
                    </div>
                 </div>
               )}
            </div>

            <div className={styles.modalFooter}>
               <Button onClick={() => setIsViewModalOpen(false)}>Close</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ComplaintsPage;
