import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft } from 'lucide-react';
import styles from './AddVisitorPage.module.css';

// Standardized UI Components
import PageHeader from '../../../components/ui/PageHeader';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

const AddVisitorPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    visitorName: '',
    phone: '',
    checkInTime: new Date().toISOString().slice(0, 16), // Format: YYYY-MM-DDTHH:MM
    purpose: '',
    numberOfPersons: 1,
    note: '',
    idProof: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
    // Here you would typically call an API to save the visitor
    navigate('/front-office/visitors');
  };

  const purposeOptions = [
    { value: '', label: 'Select Purpose', disabled: true },
    { value: 'interview', label: 'Interview' },
    { value: 'parent-meet', label: 'Parent Meet' },
    { value: 'admission', label: 'Admission' },
    { value: 'vendor', label: 'Vendor Visit' },
    { value: 'official', label: 'Official Visit' },
  ];

  const idProofOptions = [
    { value: '', label: 'Select ID Proof', disabled: true },
    { value: 'aadhar', label: 'Aadhar Card' },
    { value: 'pan', label: 'PAN Card' },
    { value: 'driving-license', label: 'Driving License' },
    { value: 'voter-id', label: 'Voter ID' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <div className={styles.pageContainer}>
      <PageHeader 
        title="Add Visitor" 
        breadcrumbs="Dashboard / Front Office / Visitors / Add"
        actions={
          <Button 
            variant="ghost" 
            icon={<ArrowLeft size={18} />} 
            onClick={() => navigate('/front-office/visitors')}
          >
            Back to List
          </Button>
        }
      />

      <Card title="Visitor Details" className={styles.formCard}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <Input
              label="Visitor Name"
              name="visitorName"
              placeholder="Enter visitor name"
              value={formData.visitorName}
              onChange={handleChange}
              required
            />
            
            <Input
              label="Phone Number"
              name="phone"
              type="tel"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
            />

            <Select
              label="Purpose"
              name="purpose"
              options={purposeOptions}
              value={formData.purpose}
              onChange={handleChange}
              required
            />

            <Input
              label="Check In Time"
              name="checkInTime"
              type="datetime-local"
              value={formData.checkInTime}
              onChange={handleChange}
              required
            />

            <Input
              label="Number of Persons"
              name="numberOfPersons"
              type="number"
              min="1"
              value={formData.numberOfPersons}
              onChange={handleChange}
            />

            <Select
              label="ID Proof (Optional)"
              name="idProof"
              options={idProofOptions}
              value={formData.idProof}
              onChange={handleChange}
            />

            <Input
              label="Note / Remarks"
              name="note"
              placeholder="Any additional notes..."
              value={formData.note}
              onChange={handleChange}
              multiline
              className={styles.fullWidth}
            />
          </div>

          <div className={styles.formActions}>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => navigate('/front-office/visitors')}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              icon={<Save size={18} />}
            >
              Save Visitor
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddVisitorPage;
