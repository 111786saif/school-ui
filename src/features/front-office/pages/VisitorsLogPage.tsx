import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, 
  Search, 
  FileText, 
  User, 
  Filter,
  Loader2,
  AlertCircle,
  Edit,
  LogOut,
  X,
  Clock,
  Eye,
  Calendar as CalendarIcon,
  Phone,
  Info
} from 'lucide-react';
import styles from './VisitorsLogPage.module.css';

// Standardized UI Components
import PageHeader from '../../../components/ui/PageHeader';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { visitorsService, Visitor } from '../api/visitorsService';

const VisitorsLogPage: React.FC = () => {
  const navigate = useNavigate();
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [purpose, setPurpose] = useState('');
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0
  });

  // Modal States
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedVisitor, setSelectedVisitor] = useState<Visitor | null>(null);
  const [visitorDetails, setVisitorDetails] = useState<Visitor | null>(null);
  
  const [checkoutData, setCheckoutData] = useState({
    checkOutTime: '',
    remarks: ''
  });
  const [modalLoading, setModalLoading] = useState(false);

  useEffect(() => {
    fetchVisitors();
  }, [pagination.page, pagination.size]); 

  const fetchVisitors = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await visitorsService.getAll({
        page: pagination.page,
        size: pagination.size,
        search: searchTerm || undefined, 
        purpose: purpose || undefined
      });

      setVisitors(response.content);
      setPagination(prev => ({
        ...prev,
        totalElements: response.page.totalElements,
        totalPages: response.page.totalPages
      }));

    } catch (err: any) {
      console.error('Failed to fetch visitors:', err);
      setError('Failed to load visitor records.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination(prev => ({ ...prev, page: 0 })); 
    fetchVisitors();
  };

  const handleViewClick = async (id: string) => {
    try {
      setModalLoading(true);
      setIsViewModalOpen(true);
      const data = await visitorsService.getById(id);
      setVisitorDetails(data);
    } catch (err) {
      console.error("Failed to fetch visitor details:", err);
      alert("Failed to load visitor details.");
      setIsViewModalOpen(false);
    } finally {
      setModalLoading(false);
    }
  };

  const handleEditClick = (id: string) => {
    console.log("Edit visitor:", id);
    // navigate(`/front-office/visitors/edit/${id}`);
  };

  const handleCheckoutClick = (visitor: Visitor) => {
    setSelectedVisitor(visitor);
    const now = new Date();
    const localISOTime = new Date(now.getTime() - (now.getTimezoneOffset() * 60000)).toISOString().slice(0, 16);
    
    setCheckoutData({
      checkOutTime: localISOTime,
      remarks: ''
    });
    
    setIsCheckoutModalOpen(true);
  };

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVisitor) return;

    setModalLoading(true);
    try {
      await visitorsService.checkout(selectedVisitor.id, {
        checkOutTime: new Date(checkoutData.checkOutTime).toISOString(),
        remarks: checkoutData.remarks
      });
      setIsCheckoutModalOpen(false);
      fetchVisitors();
    } catch (err) {
      console.error("Failed to checkout visitor:", err);
      alert("Failed to checkout visitor. Please try again.");
    } finally {
      setModalLoading(false);
    }
  };

  const formatTime = (isoString: string) => {
    if (!isoString) return '-';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (isoString: string) => {
    if (!isoString) return '-';
    return new Date(isoString).toLocaleDateString('en-GB', { 
        day: '2-digit', month: 'short', year: 'numeric' 
    });
  };

  const purposeOptions = [
    { value: '', label: 'All Purposes' },
    { value: 'admission inquiry', label: 'Admission Inquiry' },
    { value: 'parent meet', label: 'Parent Meet' },
    { value: 'interview', label: 'Interview' },
    { value: 'vendor', label: 'Vendor' },
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
        <div className={styles.filterSection}>
          <div className={styles.searchBox}>
            <Input 
              placeholder="Search by Name or Phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={18} className="text-gray-400" />}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          
          <div className={styles.filterControls}>
             <Select 
              options={purposeOptions}
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className={styles.purposeSelect}
            />
            <Button variant="secondary" icon={<Filter size={16} />} onClick={handleSearch}>Filter</Button>
          </div>
        </div>

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
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '40px' }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
                      <Loader2 className="animate-spin" /> Loading records...
                    </div>
                  </td>
                </tr>
              ) : error ? (
                 <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                      <AlertCircle size={32} />
                      <p>{error}</p>
                      <Button variant="secondary" size="sm" onClick={fetchVisitors}>Retry</Button>
                    </div>
                  </td>
                </tr>
              ) : visitors.length > 0 ? (
                visitors.map((visitor) => (
                  <tr key={visitor.id}>
                    <td>
                      <div className={styles.visitorInfo}>
                        <div className={styles.avatarPlaceholder}>
                           <User size={16} />
                        </div>
                        <span style={{ fontWeight: 500 }}>{visitor.visitorName}</span>
                      </div>
                    </td>
                    <td>{visitor.phoneNumber}</td>
                    <td>
                      <span className={styles.purposeTag}>{visitor.purpose}</span>
                    </td>
                    <td>{visitor.numberOfPersons}</td>
                    <td>{formatDate(visitor.checkInTime)}</td>
                    <td className={styles.timeIn}>{formatTime(visitor.checkInTime)}</td>
                    <td className={styles.timeOut}>{visitor.checkOutTime ? formatTime(visitor.checkOutTime) : '-'}</td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button 
                          className={styles.actionBtn} 
                          title="View Details"
                          onClick={() => handleViewClick(visitor.id)}
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          className={styles.actionBtn} 
                          title="Edit"
                          onClick={() => handleEditClick(visitor.id)}
                        >
                          <Edit size={16} />
                        </button>
                        {!visitor.checkOutTime && (
                           <button 
                            className={styles.actionBtn} 
                            title="Checkout"
                            onClick={() => handleCheckoutClick(visitor)}
                          >
                            <LogOut size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className={styles.noData}>
                    <div className={styles.noDataContent}>
                      <FileText size={48} className={styles.noDataIcon} />
                      <p>No visitor records found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className={styles.pagination}>
          <span className={styles.pageInfo}>
             Showing {visitors.length === 0 ? 0 : pagination.page * pagination.size + 1} to {Math.min((pagination.page + 1) * pagination.size, pagination.totalElements)} of {pagination.totalElements} entries
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

      {/* Checkout Modal */}
      {isCheckoutModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleContainer}>
                <div className={styles.modalIconBox}>
                    <Clock size={20} color="#556ee6" />
                </div>
                <h2 className={styles.modalTitle}>Checkout Visitor</h2>
              </div>
              <button 
                className={styles.closeButton} 
                onClick={() => setIsCheckoutModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleCheckoutSubmit} className={styles.modalForm}>
              <div className={styles.modalBody}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: '#1e293b', marginBottom: '8px' }}>
                    Visitor Name
                  </label>
                  <div style={{ padding: '12px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', color: '#64748b' }}>
                    {selectedVisitor?.visitorName}
                  </div>
                </div>

                <Input 
                  label="Checkout Time" 
                  name="checkOutTime"
                  type="datetime-local"
                  value={checkoutData.checkOutTime}
                  onChange={(e) => setCheckoutData(prev => ({ ...prev, checkOutTime: e.target.value }))}
                  required
                />
                
                <Input 
                  label="Remarks" 
                  name="remarks"
                  placeholder="Any remarks..."
                  value={checkoutData.remarks}
                  onChange={(e) => setCheckoutData(prev => ({ ...prev, remarks: e.target.value }))}
                  multiline
                />
              </div>

              <div className={styles.modalFooter}>
                 <Button 
                    type="button" 
                    variant="ghost" 
                    onClick={() => setIsCheckoutModalOpen(false)}
                    disabled={modalLoading}
                >
                    Cancel
                </Button>
                <Button 
                  type="submit"
                  disabled={modalLoading}
                  icon={modalLoading ? <Loader2 size={16} className="animate-spin"/> : <LogOut size={16} />}
                >
                  Confirm Checkout
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
                <h2 className={styles.modalTitle}>Visitor Details</h2>
              </div>
              <button 
                className={styles.closeButton} 
                onClick={() => {
                    setIsViewModalOpen(false);
                    setVisitorDetails(null);
                }}
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
              ) : visitorDetails ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                   {/* Primary Info */}
                   <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px', backgroundColor: '#f0f5ff', borderRadius: '12px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#fff', color: '#556ee6', display: 'flex', alignItems: 'center', justifyCenter: 'center', flexShrink: 0 }}>
                        <User size={24} style={{ margin: '0 auto' }} />
                      </div>
                      <div>
                        <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#2b3674', margin: 0 }}>{visitorDetails.visitorName}</h3>
                        <p style={{ fontSize: '14px', color: '#64748b', margin: '4px 0 0' }}>Visitor ID: {visitorDetails.id.split('-')[0]}</p>
                      </div>
                   </div>

                   {/* Grid Info */}
                   <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#a3aed0', textTransform: 'uppercase' }}>Phone Number</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2b3674', fontWeight: 500 }}>
                           <Phone size={14} /> {visitorDetails.phoneNumber}
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#a3aed0', textTransform: 'uppercase' }}>Purpose</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2b3674', fontWeight: 500 }}>
                           <span className={styles.purposeTag}>{visitorDetails.purpose}</span>
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#a3aed0', textTransform: 'uppercase' }}>Number of Persons</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2b3674', fontWeight: 500 }}>
                           {visitorDetails.numberOfPersons}
                        </div>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 600, color: '#a3aed0', textTransform: 'uppercase' }}>Status</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#2b3674', fontWeight: 500 }}>
                           <span style={{ 
                               padding: '4px 8px', 
                               borderRadius: '4px', 
                               fontSize: '12px', 
                               backgroundColor: visitorDetails.status === 'ACTIVE' ? '#dcfce7' : '#f1f5f9',
                               color: visitorDetails.status === 'ACTIVE' ? '#166534' : '#64748b'
                           }}>
                             {visitorDetails.status}
                           </span>
                        </div>
                      </div>
                   </div>

                   {/* Time Info */}
                   <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#2b3674', marginBottom: '16px', marginTop: 0 }}>Visit Timeline</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                         <div style={{ display: 'flex', gap: '12px' }}>
                            <div style={{ color: '#166534', flexShrink: 0 }}><CalendarIcon size={16} /></div>
                            <div>
                               <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#2b3674' }}>Check In</p>
                               <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>{formatDate(visitorDetails.checkInTime)} at {formatTime(visitorDetails.checkInTime)}</p>
                            </div>
                         </div>
                         <div style={{ display: 'flex', gap: '12px' }}>
                            <div style={{ color: '#ef4444', flexShrink: 0 }}><CalendarIcon size={16} /></div>
                            <div>
                               <p style={{ margin: 0, fontSize: '14px', fontWeight: 600, color: '#2b3674' }}>Check Out</p>
                               <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>{visitorDetails.checkOutTime ? `${formatDate(visitorDetails.checkOutTime)} at ${formatTime(visitorDetails.checkOutTime)}` : 'Still Inside'}</p>
                            </div>
                         </div>
                      </div>
                   </div>

                   {/* Identity Proof */}
                   {(visitorDetails.idProofType || visitorDetails.idProofNumber) && (
                      <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#2b3674', marginBottom: '12px', marginTop: 0 }}>Identity Verification</h4>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                            <div>
                               <p style={{ margin: 0, fontSize: '12px', color: '#a3aed0', fontWeight: 600 }}>Type</p>
                               <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#2b3674', fontWeight: 500 }}>{visitorDetails.idProofType || '-'}</p>
                            </div>
                            <div>
                               <p style={{ margin: 0, fontSize: '12px', color: '#a3aed0', fontWeight: 600 }}>Number</p>
                               <p style={{ margin: '4px 0 0', fontSize: '14px', color: '#2b3674', fontWeight: 500 }}>{visitorDetails.idProofNumber || '-'}</p>
                            </div>
                        </div>
                      </div>
                   )}

                   {/* Remarks */}
                   {visitorDetails.remarks && (
                      <div style={{ padding: '16px', borderRadius: '12px', backgroundColor: '#fafbfc', border: '1px solid #e2e8f0' }}>
                        <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#2b3674', marginBottom: '8px', marginTop: 0 }}>Remarks</h4>
                        <p style={{ margin: 0, fontSize: '14px', color: '#475569', lineHeight: 1.5 }}>{visitorDetails.remarks}</p>
                      </div>
                   )}
                </div>
              ) : null}
            </div>

            <div className={styles.modalFooter}>
               <Button 
                  type="button" 
                  onClick={() => {
                    setIsViewModalOpen(false);
                    setVisitorDetails(null);
                  }}
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

export default VisitorsLogPage;
