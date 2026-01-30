import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  Filter, 
  LayoutList, 
  X,
  FileText,
  Loader2,
  AlertCircle,
  Eye,
  Phone,
  MoreHorizontal
} from 'lucide-react';
import styles from './AdmissionEnquiryPage.module.css';

// Standardized UI Components
import PageHeader from '../../../components/ui/PageHeader';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { admissionService, AdmissionEnquiry, UpdateFollowUpDto } from '../api/admissionService';

const AdmissionEnquiryPage: React.FC = () => {
  const navigate = useNavigate();
  
  // Data State
  const [enquiries, setEnquiries] = useState<AdmissionEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  });

  // Modal State
  const [isFollowUpModalOpen, setIsFollowUpModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedEnquiry, setSelectedEnquiry] = useState<AdmissionEnquiry | null>(null);
  const [modalLoading, setModalLoading] = useState(false);
  
  // Follow Up Form State
  const [followUpData, setFollowUpData] = useState({
    note: '',
    nextDate: '',
    followUpDate: new Date().toISOString().slice(0, 10)
  });

  useEffect(() => {
    fetchEnquiries();
  }, [pagination.page, pagination.size]);

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await admissionService.getAll({
        page: pagination.page,
        size: pagination.size,
        search: searchTerm || undefined,
        status: statusFilter || undefined,
        sort: 'createdAt,desc'
      });
      setEnquiries(response.content);
      setPagination(prev => ({
        ...prev,
        totalElements: response.page.totalElements,
        totalPages: response.page.totalPages
      }));
    } catch (err) {
      console.error('Failed to fetch enquiries:', err);
      setError('Failed to load admission enquiries.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 0 }));
    fetchEnquiries();
  };

  // --- Actions ---

  const handleFollowUpClick = (enquiry: AdmissionEnquiry) => {
    setSelectedEnquiry(enquiry);
    setFollowUpData({
      note: '',
      nextDate: '',
      followUpDate: new Date().toISOString().slice(0, 10)
    });
    setIsFollowUpModalOpen(true);
  };

  const handleSaveFollowUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEnquiry) return;

    setModalLoading(true);
    try {
      const payload: UpdateFollowUpDto = {
        followUpDate: followUpData.followUpDate,
        note: followUpData.note,
        nextFollowUpDate: followUpData.nextDate || undefined
      };
      await admissionService.updateFollowUp(selectedEnquiry.id, payload);
      setIsFollowUpModalOpen(false);
      fetchEnquiries();
    } catch (err) {
      console.error('Failed to save follow up:', err);
      alert('Failed to save follow up.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleCloseEnquiry = async (id: string) => {
    if (!window.confirm('Are you sure you want to close this enquiry?')) return;
    try {
      await admissionService.updateStatus(id, 'CLOSED');
      fetchEnquiries();
    } catch (err) {
      console.error('Failed to close enquiry:', err);
      alert('Failed to update status.');
    }
  };

  const handleViewClick = async (id: string) => {
    try {
      setModalLoading(true); // Reusing modal loading for fetch indication if needed, or just open
      setIsViewModalOpen(true);
      const data = await admissionService.getById(id);
      setSelectedEnquiry(data);
    } catch (err) {
      console.error('Failed to fetch details:', err);
      alert('Failed to load details.');
      setIsViewModalOpen(false);
    } finally {
      setModalLoading(false);
    }
  };

  // --- Helpers ---

  const formatDate = (dateStr?: string) => {
    if (!dateStr || dateStr === '-') return '-';
    return new Date(dateStr).toLocaleDateString('en-GB', {
        day: '2-digit', month: 'short', year: 'numeric'
    });
  };

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'NEW', label: 'New' },
    { value: 'FOLLOW_UP', label: 'Follow Up' },
    { value: 'CONVERTED', label: 'Converted' },
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
        title="Admission Enquiries" 
        breadcrumbs="Dashboard / Front Office"
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
              <div style={{ fontSize: '14px', marginBottom: '8px', color: '#64748b' }}>Search</div>
              <Input 
                placeholder="Search Name/Phone" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              />
           </div>
           
           <div style={{ flex: 1, maxWidth: '250px' }}>
              <div style={{ fontSize: '14px', marginBottom: '8px', color: '#64748b' }}>Status</div>
              <Select 
                options={statusOptions}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              />
           </div>

           <div style={{ marginTop: '28px' }}>
              <Button variant="primary" style={{ height: '42px' }} onClick={handleSearch}>Filter</Button>
           </div>
        </div>

        {/* Table Controls */}
        <div className={styles.controlsRow}>
          <div className={styles.entriesControl}>
            Row Per Page 
            <Select 
              options={entriesOptions} 
              className={styles.entriesSelect}
              value={String(pagination.size)}
              onChange={(e) => setPagination(prev => ({ ...prev, size: Number(e.target.value), page: 0 }))}
            />
            Entries
          </div>
        </div>

        {/* Table */}
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Ref</th>
                <th>Name</th>
                <th>Phone</th>
                <th>Source</th>
                <th>Status</th>
                <th>Next Follow Up</th>
                <th>Assigned To</th>
                <th className={styles.actionColumn}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                      <Loader2 className="animate-spin" /> Loading...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                      <AlertCircle size={32} />
                      <p>{error}</p>
                      <Button variant="secondary" size="sm" onClick={fetchEnquiries}>Retry</Button>
                    </div>
                  </td>
                </tr>
              ) : enquiries.length > 0 ? (
                enquiries.map((item) => (
                  <tr key={item.id}>
                    <td>#{item.id.substring(0, 6).toUpperCase()}</td>
                    <td>
                      <div className={styles.personInfo}>
                        <span className={styles.personName}>{item.enquirerName}</span>
                        <span className={styles.subText}>{item.enquiryType}</span>
                      </div>
                    </td>
                    <td>{item.phoneNumber}</td>
                    <td>{item.source}</td>
                    <td>
                      <span className={`${styles.statusBadge} ${
                        item.status === 'CLOSED' ? styles.statusDead : 
                        item.status === 'NEW' ? styles.statusNew : 
                        item.status === 'CONVERTED' ? styles.statusWon : styles.statusActive
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td>{formatDate(item.nextFollowUpDate)}</td>
                    <td>{item.assignedTo || '-'}</td>
                    <td>
                      <div className={styles.actions}>
                        <button 
                          className={styles.btnFollowUp}
                          onClick={() => handleFollowUpClick(item)}
                        >
                          Follow Up
                        </button>
                        {item.status !== 'CLOSED' && (
                          <button 
                            className={styles.btnClose}
                            onClick={() => handleCloseEnquiry(item.id)}
                          >
                            Close
                          </button>
                        )}
                        <button 
                          className={styles.actionBtn} 
                          title="View Details"
                          onClick={() => handleViewClick(item.id)}
                        >
                           <Eye size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
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
          <span className={styles.pageInfo}>
             Showing {enquiries.length === 0 ? 0 : pagination.page * pagination.size + 1} to {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} of {pagination.totalElements} entries
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

      {/* Add Follow Up Modal */}
      {isFollowUpModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Add Follow Up</h2>
              <button 
                className={styles.closeButton}
                onClick={() => setIsFollowUpModalOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSaveFollowUp} className={styles.modalForm}>
              <div className={styles.modalBody}>
                <Input 
                  label="Note *"
                  name="note"
                  value={followUpData.note}
                  onChange={(e) => setFollowUpData(prev => ({ ...prev, note: e.target.value }))}
                  multiline
                  rows={4}
                  required
                />
                
                <Input 
                  label="Next Follow Up Date"
                  type="date" 
                  name="nextDate"
                  value={followUpData.nextDate}
                  onChange={(e) => setFollowUpData(prev => ({ ...prev, nextDate: e.target.value }))}
                />
              </div>

              <div className={styles.modalFooter}>
                <Button type="submit" disabled={modalLoading}>
                  {modalLoading ? <Loader2 size={16} className="animate-spin" /> : 'Save Note'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Details Modal */}
      {isViewModalOpen && selectedEnquiry && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Enquiry Details</h2>
              <button 
                className={styles.closeButton}
                onClick={() => setIsViewModalOpen(false)}
              >
                <X size={24} />
              </button>
            </div>
            
            <div className={styles.modalBody}>
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label className={styles.summaryLabel}>Name</label>
                    <div style={{ fontWeight: 600 }}>{selectedEnquiry.enquirerName}</div>
                  </div>
                  <div>
                    <label className={styles.summaryLabel}>Phone</label>
                    <div style={{ fontWeight: 600 }}>{selectedEnquiry.phoneNumber}</div>
                  </div>
                  <div>
                    <label className={styles.summaryLabel}>Type</label>
                    <div>{selectedEnquiry.enquiryType}</div>
                  </div>
                  <div>
                    <label className={styles.summaryLabel}>Source</label>
                    <div>{selectedEnquiry.source}</div>
                  </div>
                  <div>
                    <label className={styles.summaryLabel}>Enquiry Date</label>
                    <div>{formatDate(selectedEnquiry.enquiryDate)}</div>
                  </div>
                  <div>
                    <label className={styles.summaryLabel}>Status</label>
                    <div>{selectedEnquiry.status}</div>
                  </div>
               </div>
               
               <div style={{ marginTop: '16px' }}>
                  <label className={styles.summaryLabel}>Description</label>
                  <div style={{ padding: '12px', background: '#f8fafc', borderRadius: '8px', marginTop: '4px' }}>
                    {selectedEnquiry.description || 'No description provided.'}
                  </div>
               </div>

               <div style={{ marginTop: '16px' }}>
                  <label className={styles.summaryLabel}>Internal Remarks</label>
                  <div style={{ padding: '12px', background: '#fff7ed', borderRadius: '8px', marginTop: '4px', color: '#c2410c' }}>
                    {selectedEnquiry.remarks || 'No remarks.'}
                  </div>
               </div>
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

export default AdmissionEnquiryPage;
