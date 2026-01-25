import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';
import styles from './AddVisitorPage.module.css';

// Standardized UI Components
import PageHeader from '../../../components/ui/PageHeader';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { visitorsService, CreateVisitorDto } from '../api/visitorsService';

const AddVisitorPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    visitorName: '',
    phone: '',
    checkInTime: new Date().toISOString().slice(0, 16), // Format: YYYY-MM-DDTHH:MM
    purpose: '',
    numberOfPersons: 1,
    note: '',
    idProof: '',
    idProofNumber: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Transform data to match API DTO
      const payload: CreateVisitorDto = {
        visitorName: formData.visitorName,
        phoneNumber: formData.phone,
        purpose: formData.purpose,
        numberOfPersons: Number(formData.numberOfPersons),
        checkInTime: new Date(formData.checkInTime).toISOString(), // Convert to ISO string for API
        idProofType: formData.idProof || undefined,
        idProofNumber: formData.idProofNumber || undefined,
        remarks: formData.note || undefined
      };

      await visitorsService.create(payload);
      navigate('/front-office/visitors');
    } catch (err: any) {
      console.error('Failed to create visitor:', err);
      setError(err.message || 'Failed to save visitor. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const purposeOptions = [
    { value: '', label: 'Select Purpose', disabled: true },
    { value: 'admission inquiry', label: 'Admission Inquiry' },
    { value: 'parent meet', label: 'Parent Meet' },
    { value: 'interview', label: 'Interview' },
    { value: 'vendor', label: 'Vendor Visit' },
    { value: 'official', label: 'Official Visit' },
  ];

  const idProofOptions = [
    { value: '', label: 'Select ID Proof', disabled: true },
    { value: 'Adhaar Card', label: 'Aadhar Card' },
    { value: 'PAN Card', label: 'PAN Card' },
    { value: 'Driving License', label: 'Driving License' },
    { value: 'Voter ID', label: 'Voter ID' },
    { value: 'Other', label: 'Other' },
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
        {error && (
          <div style={{ 
            padding: '12px', 
            backgroundColor: '#fee2e2', 
            color: '#991b1b', 
            borderRadius: '8px', 
            marginBottom: '20px',
            fontSize: '14px'
          }}>
            {error}
          </div>
        )}

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
              required
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
              required
            />

            <Select
              label="ID Proof Type (Optional)"
              name="idProof"
              options={idProofOptions}
              value={formData.idProof}
              onChange={handleChange}
            />

            <Input
               label="ID Proof Number (Optional)"
               name="idProofNumber"
               placeholder="Enter ID number"
               value={formData.idProofNumber}
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
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              icon={loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Visitor'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddVisitorPage;