import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Calendar, 
  Lock, 
  X,
  Search,
  Filter,
  FileText,
  Check,
  AlertCircle
} from 'lucide-react';
import styles from './AcademicYearSettingsPage.module.css';
import PageHeader from '../../../components/ui/PageHeader';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { AcademicYear, academicYearService } from '../api/academicYearService';

const AcademicYearSettingsPage: React.FC = () => {
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    startDate: '',
    endDate: '',
    isCurrent: false
  });

  useEffect(() => {
    fetchAcademicYears();
  }, []);

  const fetchAcademicYears = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await academicYearService.getAll();
      setAcademicYears(data);
    } catch (error) {
      console.error('Failed to fetch academic years', error);
      setError('Failed to load academic years. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleMakeCurrent = async (id: string) => {
    try {
      await academicYearService.update(id, { isCurrent: true });
      fetchAcademicYears();
    } catch (error) {
      console.error('Failed to update academic year status', error);
      // Optional: Show a toast notification here
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await academicYearService.create(formData);
      setIsModalOpen(false);
      setFormData({ name: '', startDate: '', endDate: '', isCurrent: false });
      fetchAcademicYears();
    } catch (error) {
      console.error('Failed to create academic year', error);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const entriesOptions = [
    { value: '10', label: '10' },
    { value: '25', label: '25' },
    { value: '50', label: '50' },
  ];

  return (
    <div className={styles.pageContainer}>
      <PageHeader 
        title="Academic Year Settings" 
        breadcrumbs="Dashboard / Settings / Academic Year" 
        actions={
          <Button 
            icon={<Plus size={18} />} 
            onClick={() => setIsModalOpen(true)}
          >
            Create Academic Year
          </Button>
        }
      />

      <Card className={styles.mainCard}>
        {/* Filter Section */}
        <div className={styles.filterSection}>
          <div className={styles.searchBox}>
            <Input 
              placeholder="Search Name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={18} className="text-gray-400" />}
            />
          </div>
          <div className={styles.filterControls}>
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
                <th>Start Date</th>
                <th>End Date</th>
                <th>Status</th>
                <th className={styles.actionColumn}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '40px' }}>Loading...</td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '40px', color: '#ef4444' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                      <AlertCircle size={32} />
                      <p>{error}</p>
                      <Button variant="secondary" size="sm" onClick={fetchAcademicYears}>Retry</Button>
                    </div>
                  </td>
                </tr>
              ) : academicYears.length > 0 ? (
                academicYears.map((year) => (
                  <tr key={year.id}>
                    <td>{year.name}</td>
                    <td>{formatDate(year.startDate)}</td>
                    <td>{formatDate(year.endDate)}</td>
                    <td>
                      {year.isCurrent && (
                        <span className={`${styles.statusBadge} ${styles.statusCurrent}`}>
                          Current
                        </span>
                      )}
                    </td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button className={styles.actionBtn} title="View Calendar">
                          <Calendar size={18} />
                        </button>
                        {!year.isCurrent && (
                          <button 
                            className={styles.actionBtn} 
                            title="Make Current"
                            onClick={() => handleMakeCurrent(year.id)}
                          >
                            <Check size={18} />
                          </button>
                        )}
                        <button className={styles.actionBtn} title="Lock Year">
                          <Lock size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className={styles.noData}>
                    <div className={styles.noDataContent}>
                      <FileText size={48} className={styles.noDataIcon} />
                      <p>No academic years found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className={styles.pagination}>
          <span className={styles.pageInfo}>Showing {academicYears.length > 0 ? 1 : 0} to {academicYears.length} of {academicYears.length} entries</span>
          <div className={styles.pageButtons}>
            <Button variant="ghost" size="sm" disabled>Previous</Button>
            <Button variant="ghost" size="sm" disabled>Next</Button>
          </div>
        </div>
      </Card>

      {/* Add Academic Year Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleContainer}>
                <div className={styles.modalIconBox}>
                    <Calendar size={20} color="#556ee6" />
                </div>
                <h2 className={styles.modalTitle}>Add Academic Year</h2>
              </div>
              <button 
                className={styles.closeButton} 
                onClick={() => setIsModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className={styles.modalForm}>
              <div className={styles.modalBody}>
                <Input 
                  label="Name" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="e.g. 2024-2025" 
                  required
                />
                
                <Input 
                  label="Start Date" 
                  type="date" 
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                />

                <Input 
                  label="End Date" 
                  type="date" 
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                />

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                  <input 
                    type="checkbox" 
                    id="isCurrent" 
                    name="isCurrent"
                    checked={formData.isCurrent}
                    onChange={handleInputChange}
                  />
                  <label htmlFor="isCurrent" style={{ fontSize: '14px', color: '#1e293b', cursor: 'pointer' }}>
                    Set as current academic year
                  </label>
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
                <Button type="submit">
                  Submit
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AcademicYearSettingsPage;
