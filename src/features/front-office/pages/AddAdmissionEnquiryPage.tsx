import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Save, ArrowLeft, Loader2 } from 'lucide-react';
import styles from './AddAdmissionEnquiryPage.module.css';

// Standardized UI Components
import PageHeader from '../../../components/ui/PageHeader';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import { admissionService, CreateAdmissionEnquiryDto } from '../api/admissionService';

const AddAdmissionEnquiryPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    enquirerName: '',
    phoneNumber: '',
    enquiryType: 'PARENT',
    source: 'WALK_IN',
    enquiryDate: new Date().toISOString().slice(0, 10),
    nextFollowUpDate: '',
    description: '',
    remarks: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload: CreateAdmissionEnquiryDto = {
        ...formData,
        // Ensure optional empty strings are handled if necessary, 
        // but DTO allows string | undefined. 
        // For date, if empty, we might want to send undefined or rely on backend validation.
        nextFollowUpDate: formData.nextFollowUpDate || undefined,
        description: formData.description || undefined,
        remarks: formData.remarks || undefined
      };

      await admissionService.create(payload);
      navigate('/front-office/admission-enquiries');
    } catch (error) {
      console.error('Failed to create enquiry:', error);
      alert('Failed to save enquiry. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  const typeOptions = [
    { value: 'PARENT', label: 'Parent' },
    { value: 'STUDENT', label: 'Student' },
    { value: 'TEACHER', label: 'Teacher' },
    { value: 'OTHER', label: 'Other' },
  ];

  const sourceOptions = [
    { value: 'WALK_IN', label: 'Walk In' },
    { value: 'WEBSITE', label: 'Website' },
    { value: 'CALL', label: 'Call' },
    { value: 'REFERRAL', label: 'Referral' },
    { value: 'OTHER', label: 'Other' },
  ];

  return (
    <div className={styles.pageContainer}>
      <PageHeader 
        title="New Enquiry" 
        breadcrumbs="Dashboard / Front Office / Enquiries / Add"
        actions={
          <Button 
            variant="ghost" 
            icon={<ArrowLeft size={18} />} 
            onClick={() => navigate('/front-office/admission-enquiries')}
          >
            Back to List
          </Button>
        }
      />

      <Card title="Enquiry Details" className={styles.formCard}>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGrid}>
            <Input
              label="Name"
              name="enquirerName"
              placeholder="Enter name"
              value={formData.enquirerName}
              onChange={handleChange}
              required
            />
            
            <Input
              label="Phone Number"
              name="phoneNumber"
              type="tel"
              placeholder="Enter phone number"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
            />

            <Select
              label="Type"
              name="enquiryType"
              options={typeOptions}
              value={formData.enquiryType}
              onChange={handleChange}
              required
            />

            <Select
              label="Source"
              name="source"
              options={sourceOptions}
              value={formData.source}
              onChange={handleChange}
              required
            />

            <Input
              label="Enquiry Date"
              name="enquiryDate"
              type="date"
              value={formData.enquiryDate}
              onChange={handleChange}
              required
            />

            <Input
              label="Next Follow Up Date"
              name="nextFollowUpDate"
              type="date"
              value={formData.nextFollowUpDate}
              onChange={handleChange}
            />

            <div className={styles.fullWidth}>
              <Input
                label="Description"
                name="description"
                placeholder="Enter details about the enquiry..."
                value={formData.description}
                onChange={handleChange}
                multiline
                rows={3}
              />
            </div>

            <div className={styles.fullWidth} style={{ marginTop: '-12px' }}>
              <Input
                label="Remarks"
                name="remarks"
                placeholder="Internal remarks..."
                value={formData.remarks}
                onChange={handleChange}
                multiline
                rows={2}
              />
            </div>
          </div>

          <div className={styles.formActions}>
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => navigate('/front-office/admission-enquiries')}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              icon={loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              disabled={loading}
            >
              Save Enquiry
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default AddAdmissionEnquiryPage;