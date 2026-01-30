import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Layout, 
  MoreHorizontal, 
  Edit, 
  Trash2,
  X,
  Loader2,
  AlertCircle
} from 'lucide-react';
import styles from './ClassRoomPage.module.css';

// Standardized UI Components
import PageHeader from '../../../components/ui/PageHeader';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { classRoomService, ClassRoom, CreateClassRoomDto } from '../api/classRoomService';

const ClassRoomPage: React.FC = () => {
  // Data State
  const [classRooms, setClassRooms] = useState<ClassRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState<CreateClassRoomDto>({
    roomNumber: '',
    name: '',
    capacity: 0,
    infraType: '',
    buildingBlock: '',
    status: 'Active'
  });

  // Filter State (Placeholder for future implementation)
  const [searchTerm, setSearchTerm] = useState('');

  // --- Effects ---
  useEffect(() => {
    console.log("ClassRoomPage mounted");
    fetchClassRooms();
  }, []);

  // --- API Handlers ---
  const fetchClassRooms = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await classRoomService.getAll();
      setClassRooms(data);
    } catch (err) {
      console.error('Failed to fetch classrooms:', err);
      setError('Failed to load classroom records.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setModalLoading(true);
    try {
      await classRoomService.create(formData);
      setIsModalOpen(false);
      resetForm();
      fetchClassRooms();
    } catch (err) {
      console.error('Failed to create classroom:', err);
      alert('Failed to save classroom. Please try again.');
    } finally {
      setModalLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this classroom?')) {
      try {
        await classRoomService.delete(id);
        fetchClassRooms();
      } catch (err) {
        console.error('Failed to delete:', err);
        alert('Failed to delete record.');
      }
    }
  };

  // --- Helpers ---
  const resetForm = () => {
    setFormData({
      roomNumber: '',
      name: '',
      capacity: 0,
      infraType: '',
      buildingBlock: '',
      status: 'Active'
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'capacity' ? Number(value) : value 
    }));
  };

  const statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Maintenance', label: 'Maintenance' },
    { value: 'Inactive', label: 'Inactive' },
  ];

  return (
    <div className={styles.pageContainer}>
      <PageHeader 
        title="Class Room" 
        breadcrumbs="Dashboard / Academic / Class Room"
        actions={
          <Button 
            icon={<Plus size={18} />} 
            onClick={() => { setIsModalOpen(true); resetForm(); }}
          >
            Add Class Room
          </Button>
        }
      />

      <Card className={styles.mainCard}>
        {/* Filter Section */}
        <div className={styles.filterSection}>
          <div className={styles.searchBox}>
            <Input 
              placeholder="Search by Name or Room No..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              icon={<Search size={18} className="text-gray-400" />}
            />
          </div>
        </div>

        {/* Table */}
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Room No</th>
                <th>Name</th>
                <th>Capacity</th>
                <th>Infra Type</th>
                <th>Building Block</th>
                <th>Status</th>
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
                      <Button variant="secondary" size="sm" onClick={fetchClassRooms}>Retry</Button>
                    </div>
                  </td>
                </tr>
              ) : classRooms.length > 0 ? (
                classRooms.map((room) => (
                  <tr key={room.id}>
                    <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{room.roomNumber}</td>
                    <td>{room.name}</td>
                    <td>{room.capacity}</td>
                    <td>{room.infraType}</td>
                    <td>{room.buildingBlock}</td>
                    <td>
                      {room.status ? (
                        <span className={`${styles.statusBadge} ${styles[`status${room.status}`]}`}>
                          {room.status}
                        </span>
                      ) : (
                        <span>-</span>
                      )}
                    </td>
                    <td>
                      <div className={styles.actionButtons}>
                        <button className={styles.actionBtn} title="Edit">
                          <Edit size={16} />
                        </button>
                        <button 
                          className={styles.actionBtn} 
                          title="Delete"
                          onClick={() => handleDelete(room.id)}
                          style={{ color: '#ef4444' }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className={styles.noData}>
                    <div className={styles.noDataContent}>
                      <Layout size={48} className={styles.noDataIcon} />
                      <p>No classrooms found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Class Room Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleContainer}>
                <div className={styles.modalIconBox}>
                    <Layout size={20} />
                </div>
                <h2 className={styles.modalTitle}>Add Class Room</h2>
              </div>
              <button className={styles.closeButton} onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className={styles.modalForm}>
              <div className={styles.modalBody}>
                <div className={styles.formGrid}>
                    <Input
                        label="Room Number"
                        name="roomNumber"
                        value={formData.roomNumber}
                        onChange={handleChange}
                        placeholder="e.g. 101"
                        required
                    />
                    <Input
                        label="Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Science Lab"
                        required
                    />
                </div>

                <div className={styles.formGrid}>
                    <Input
                        label="Capacity"
                        name="capacity"
                        type="number"
                        value={formData.capacity}
                        onChange={handleChange}
                        required
                        min="0"
                    />
                    <Input
                        label="Infra Type"
                        name="infraType"
                        value={formData.infraType}
                        onChange={handleChange}
                        placeholder="e.g. Laboratory"
                        required
                    />
                </div>

                <div className={styles.formGrid}>
                    <Input
                        label="Building Block"
                        name="buildingBlock"
                        value={formData.buildingBlock}
                        onChange={handleChange}
                        placeholder="e.g. Block A"
                        required
                    />
                    <Select
                        label="Status"
                        name="status"
                        options={statusOptions}
                        value={formData.status}
                        onChange={handleChange}
                        required
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
                <Button 
                  type="submit" 
                  disabled={modalLoading}
                  icon={modalLoading ? <Loader2 size={16} className="animate-spin" /> : undefined}
                >
                  Save Class Room
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassRoomPage;
