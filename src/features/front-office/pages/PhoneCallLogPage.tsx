import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  X, 
  Search, 
  Phone, 
  User, 
  Filter, 
  MoreHorizontal, 
  FileText,
  Loader2,
  AlertCircle,
  Eye,
  Calendar as CalendarIcon,
  Clock,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import styles from './PhoneCallLogPage.module.css';

// Standardized UI Components
import PageHeader from '../../../components/ui/PageHeader';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { phoneCallsService, PhoneCall, CreatePhoneCallDto } from '../api/phoneCallsService';

const PhoneCallLogPage: React.FC = () => {
  // Data State
  const [phoneCalls, setPhoneCalls] = useState<PhoneCall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Filter & Pagination State
  const [searchTerm, setSearchTerm] = useState('');
  const [callTypeFilter, setCallTypeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  });

  // Modal State
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedCall, setSelectedCall] = useState<PhoneCall | null>(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState<CreatePhoneCallDto>({
    callerName: '',
    phoneNumber: '',
    callDate: new Date().toISOString().slice(0, 10),
    callType: 'INCOMING',
    callDuration: '',
    description: '',
    nextFollowUpDate: '',
    remarks: ''
  });

  // --- Effects ---
  useEffect(() => {
    fetchPhoneCalls();
  }, [pagination.page, pagination.size]);

  // --- API Handlers ---
  const fetchPhoneCalls = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await phoneCallsService.getAll({
        page: pagination.page,
        size: pagination.size,
        search: searchTerm || undefined,
        callType: callTypeFilter || undefined,
        fromDate: dateFilter || undefined,
        toDate: dateFilter || undefined, // Simple single date filter for now
        sort: 'callDate,desc'
      });
      setPhoneCalls(response.content);
      setPagination(prev => ({
        ...prev,
        totalElements: response.page.totalElements,
        totalPages: response.page.totalPages
      }));
    } catch (err) {
      console.error('Failed to fetch phone calls:', err);
      setError('Failed to load phone call records.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 0 }));
    fetchPhoneCalls();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      await phoneCallsService.create({
        ...formData,
        // Ensure date is ISO format if needed, but YYYY-MM-DD is often accepted or should be formatted
        callDate: formData.callDate 
      });
      setIsLogModalOpen(false);
      resetForm();
      fetchPhoneCalls();
    } catch (err) {
      console.error('Failed to create phone call:', err);
      alert('Failed to save log. Please try again.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleViewClick = async (id: string) => {
    try {
      setModalLoading(true);
      setIsViewModalOpen(true);
      const data = await phoneCallsService.getById(id);
      setSelectedCall(data);
    } catch (err) {
      console.error('Failed to fetch details:', err);
      alert('Failed to load details.');
      setIsViewModalOpen(false);
    } finally {
      setModalLoading(false);
    }
  };

  // --- Helpers ---
  const resetForm = () => {
    setFormData({
      callerName: '',
      phoneNumber: '',
      callDate: new Date().toISOString().slice(0, 10),
      callType: 'INCOMING',
      callDuration: '',
      description: '',
      nextFollowUpDate: '',
      remarks: ''
    });
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
  const callTypeOptions = [
    { value: '', label: 'All Call Types' },
    { value: 'INCOMING', label: 'Incoming' },
    { value: 'OUTGOING', label: 'Outgoing' },
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
            onClick={() => { setIsLogModalOpen(true); resetForm(); }}
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
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <div className={styles.filterControls}>
             <Input 
                type="date" 
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className={styles.dateInput}
             />
             <Select 
              options={callTypeOptions}
              value={callTypeFilter}
              onChange={(e) => setCallTypeFilter(e.target.value)}
              className={styles.typeSelect}
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
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                      <Loader2 className="animate-spin" /> Loading records...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                      <AlertCircle size={32} />
                      <p>{error}</p>
                      <Button variant="secondary" size="sm" onClick={fetchPhoneCalls}>Retry</Button>
                    </div>
                  </td>
                </tr>
              ) : phoneCalls.length > 0 ? (
                phoneCalls.map((call) => (
                  <tr key={call.id}>
                    <td>
                      <div className={styles.visitorInfo}>
                        <div className={styles.avatarPlaceholder}>
                           <User size={16} />
                        </div>
                        <span style={{ fontWeight: 500 }}>{call.callerName}</span>
                      </div>
                    </td>
                    <td>{call.phoneNumber}</td>
                    <td>{formatDate(call.callDate)}</td>
                    <td>{formatDate(call.nextFollowUpDate)}</td>
                    <td>
                      <span className={styles.purposeTag} style={{ 
                        backgroundColor: call.callType === 'INCOMING' ? '#dcfce7' : '#fee2e2',
                        color: call.callType === 'INCOMING' ? '#166534' : '#991b1b'
                      }}>
                        {call.callType}
                      </span>
                    </td>
                    <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {call.description || '-'}
                    </td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button 
                          className={styles.actionBtn} 
                          title="View Details"
                          onClick={() => handleViewClick(call.id)}
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className={styles.noData}>
                    <div className={styles.noDataContent}>
                      <Phone size={48} className={styles.noDataIcon} />
                      <p>No call logs found</p>
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
            Showing {phoneCalls.length === 0 ? 0 : pagination.page * pagination.size + 1} to {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} of {pagination.totalElements} entries
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

      {/* Log Call Modal */}
      {isLogModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleContainer}>
                <div className={styles.modalIconBox}>
                    <Phone size={20} color="#556ee6" />
                </div>
                <h2 className={styles.modalTitle}>Log Phone Call</h2>
              </div>
              <button className={styles.closeButton} onClick={() => setIsLogModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className={styles.modalForm}>
              <div className={styles.modalBody}>
                <div className={styles.formGrid}>
                    <Input
                        label="Caller Name"
                        name="callerName"
                        value={formData.callerName}
                        onChange={handleFormChange}
                        placeholder="Enter Name"
                        required
                    />
                    <Input
                        label="Phone Number"
                        name="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleFormChange}
                        required
                        placeholder="Enter Phone"
                        type="tel"
                    />
                </div>

                <div className={styles.formGrid}>
                    <Input
                        label="Call Date"
                        name="callDate"
                        type="date"
                        value={formData.callDate}
                        onChange={handleFormChange}
                        required
                    />
                    <Input
                        label="Next Follow Up Date"
                        name="nextFollowUpDate"
                        type="date"
                        value={formData.nextFollowUpDate}
                        onChange={handleFormChange}
                    />
                </div>

                <div className={styles.formGrid}>
                    <Input
                        label="Call Duration"
                        name="callDuration"
                        placeholder="e.g. 5 mins"
                        value={formData.callDuration}
                        onChange={handleFormChange}
                    />
                     <Select
                        label="Call Type"
                        name="callType"
                        options={[
                            {value: 'INCOMING', label: 'Incoming'},
                            {value: 'OUTGOING', label: 'Outgoing'},
                        ]}
                        value={formData.callType}
                        onChange={handleFormChange}
                        required
                    />
                </div>
                
                <div className={styles.formFull}>
                    <Input
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleFormChange}
                        multiline
                        rows={2}
                        placeholder="Call purpose..."
                    />
                    <div style={{ marginTop: '16px' }}>
                      <Input
                          label="Remarks / Note"
                          name="remarks"
                          value={formData.remarks}
                          onChange={handleFormChange}
                          multiline
                          rows={2}
                          placeholder="Additional notes..."
                      />
                    </div>
                </div>
              </div>

              <div className={styles.modalFooter}>
                <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => setIsLogModalOpen(false)}
                    disabled={modalLoading}
                >
                    Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={modalLoading}
                  icon={modalLoading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                >
                  Save Log
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
                    <FileText size={20} color="#556ee6" />
                </div>
                <h2 className={styles.modalTitle}>Call Details</h2>
              </div>
              <button 
                className={styles.closeButton} 
                onClick={() => { setIsViewModalOpen(false); setSelectedCall(null); }}
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
              ) : selectedCall ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                   <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#2b3674' }}>
                          <User size={20} />
                        </div>
                        <div>
                          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#2b3674', margin: 0 }}>{selectedCall.callerName}</h3>
                          <p style={{ fontSize: '13px', color: '#64748b', margin: '2px 0 0' }}>{selectedCall.phoneNumber}</p>
                        </div>
                      </div>
                      <span style={{ 
                          padding: '6px 12px', 
                          borderRadius: '20px', 
                          fontSize: '12px', 
                          fontWeight: 600,
                          backgroundColor: selectedCall.callType === 'INCOMING' ? '#dcfce7' : '#fee2e2',
                          color: selectedCall.callType === 'INCOMING' ? '#166534' : '#991b1b',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px'
                      }}>
                        {selectedCall.callType === 'INCOMING' ? <ArrowRight size={14} /> : <ArrowLeft size={14} />}
                        {selectedCall.callType}
                      </span>
                   </div>

                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#a3aed0', textTransform: 'uppercase' }}>Date</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2b3674', fontWeight: 500 }}>
                           <CalendarIcon size={14} /> {formatDate(selectedCall.callDate)}
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#a3aed0', textTransform: 'uppercase' }}>Duration</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2b3674', fontWeight: 500 }}>
                           <Clock size={14} /> {selectedCall.callDuration || '-'}
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#a3aed0', textTransform: 'uppercase' }}>Next Follow Up</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2b3674', fontWeight: 500 }}>
                           <CalendarIcon size={14} /> {formatDate(selectedCall.nextFollowUpDate)}
                        </div>
                      </div>
                   </div>

                   <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#2b3674', marginBottom: '8px', marginTop: 0 }}>Description</h4>
                      <p style={{ margin: 0, fontSize: '14px', color: '#475569', lineHeight: 1.5 }}>
                        {selectedCall.description || 'No description provided.'}
                      </p>
                   </div>

                   {selectedCall.remarks && (
                      <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#fff7ed', border: '1px solid #ffedd5' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#c2410c', marginBottom: '8px', marginTop: 0 }}>Remarks</h4>
                        <p style={{ margin: 0, fontSize: '14px', color: '#9a3412', lineHeight: 1.5 }}>
                          {selectedCall.remarks}
                        </p>
                      </div>
                   )}
                </div>
              ) : null}
            </div>

            <div className={styles.modalFooter}>
               <Button 
                  type="button" 
                  onClick={() => { setIsViewModalOpen(false); setSelectedCall(null); }}
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

export default PhoneCallLogPage;