import React, { useState } from 'react';
import { Printer, Search, Plus, Calendar, Users, Clock, FileText, X, Filter } from 'lucide-react';
import styles from './HalfDayNoticesPage.module.css';

// Standardized UI Components
import PageHeader from '../../../components/ui/PageHeader';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const HalfDayNoticesPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().slice(0, 10));
  const [selectedClass, setSelectedClass] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Modal Form State
  const [formData, setFormData] = useState({
    studentName: '',
    classSection: '',
    outTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
    reason: '',
    parentName: '',
    parentPhone: ''
  });

  const handleModalChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Notice Submitted:', formData);
    setIsModalOpen(false);
  };

  const classOptions = [
    { value: '', label: 'All Classes' },
    { value: 'Class 1-A', label: 'Class 1-A' },
    { value: 'Class 2-A', label: 'Class 2-A' },
    { value: 'Class 3-B', label: 'Class 3-B' },
  ];

  const modalClassOptions = [
    { value: '', label: 'Select Class', disabled: true },
    { value: 'Class 1-A', label: 'Class 1-A' },
    { value: 'Class 2-A', label: 'Class 2-A' },
    { value: 'Class 3-B', label: 'Class 3-B' },
  ];

  return (
    <div className={styles.pageContainer}>
      <PageHeader 
        title="Half Day Notices" 
        breadcrumbs="Dashboard / Front Office / Half Day"
        actions={
          <div className={styles.headerActions}>
            <Button 
              variant="secondary" 
              icon={<Printer size={18} />}
            >
              Print List
            </Button>
            <Button 
              icon={<Plus size={18} />}
              onClick={() => setIsModalOpen(true)}
            >
              Add Notice
            </Button>
          </div>
        }
      />

      <Card className={styles.mainCard}>
        {/* Filter Section */}
        <div className={styles.filterSection}>
           <div className={styles.searchBox}>
              <Input 
                type="date" 
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                icon={<Calendar size={18} className="text-gray-400" />}
              />
           </div>
           
           <div className={styles.filterControls}>
              <Select 
                options={classOptions}
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className={styles.classSelect}
              />
              <Button variant="secondary" icon={<Filter size={16} />}>Filter</Button>
           </div>
        </div>

        {/* Table Section */}
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th style={{ width: '60px' }}>#</th>
                <th>Student Details</th>
                <th>Class</th>
                <th>Out Time</th>
                <th>Reason</th>
                <th>Guardian</th>
                <th className={styles.actionColumn}>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* Placeholder Row */}
              {/* 
              <tr>
                <td>1</td>
                <td>
                  <div className={styles.studentInfo}>
                     <span className={styles.studentName}>Rahul Kumar</span>
                     <span className={styles.admNo}>ADM: 2023001</span>
                  </div>
                </td>
                <td><span className={styles.badge}>Class 1-A</span></td>
                <td className={styles.timeText}>12:30 PM</td>
                <td>Health Issue</td>
                <td>
                    <div className={styles.guardianInfo}>
                        <span>Mr. Sharma</span>
                        <small>9876543210</small>
                    </div>
                </td>
                <td><Button variant="ghost" size="sm" icon={<Printer size={16}/>} /></td>
              </tr>
              */}
              <tr>
                <td colSpan={7} className={styles.noData}>
                  <div className={styles.noDataContent}>
                    <FileText size={48} className={styles.noDataIcon} />
                    <p>No half day notices found for this date.</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add Notice Modal */}
      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <div className={styles.modalHeader}>
              <div className={styles.modalTitleContainer}>
                <div className={styles.modalIconBox}>
                    <Clock size={20} color="#556ee6" />
                </div>
                <h2 className={styles.modalTitle}>Add Half Day Notice</h2>
              </div>
              <button className={styles.closeButton} onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleModalSubmit} className={styles.modalForm}>
              <div className={styles.modalBody}>
                <div className={styles.formGrid}>
                  <Input 
                    label="Student Name"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleModalChange}
                    required
                    placeholder="Enter Student Name"
                    icon={<Users size={16} />}
                  />
                  <Select 
                    label="Class & Section"
                    name="classSection"
                    options={modalClassOptions}
                    value={formData.classSection}
                    onChange={handleModalChange}
                    required
                  />
                </div>

                <div className={styles.formGrid}>
                   <Input 
                    label="Out Time"
                    name="outTime"
                    type="time"
                    value={formData.outTime}
                    onChange={handleModalChange}
                    required
                  />
                   <Input 
                    label="Reason"
                    name="reason"
                    value={formData.reason}
                    onChange={handleModalChange}
                    placeholder="e.g. Health Issue"
                    required
                  />
                </div>

                <div className={styles.formGrid}>
                  <Input 
                    label="Guardian Name"
                    name="parentName"
                    value={formData.parentName}
                    onChange={handleModalChange}
                    placeholder="Picked up by..."
                  />
                   <Input 
                    label="Guardian Phone"
                    name="parentPhone"
                    type="tel"
                    value={formData.parentPhone}
                    onChange={handleModalChange}
                    placeholder="Contact Number"
                    icon={<Users size={16} />}
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
                <Button type="submit">Create Notice</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HalfDayNoticesPage;
