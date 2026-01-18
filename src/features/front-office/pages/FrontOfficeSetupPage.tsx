import React, { useState } from 'react';
import { Save, Tag, Settings, Trash2, Edit, CheckCircle } from 'lucide-react';
import styles from './FrontOfficeSetupPage.module.css';

// Standardized UI Components
import PageHeader from '../../../components/ui/PageHeader';
import Button from '../../../components/ui/Button';
import Card from '../../../components/ui/Card';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';

// Mock Data for the Master List
const initialCategories = {
  'Visitor Purpose': ['Admission Enquiry', 'Fee Payment', 'Meeting Staff', 'Seminar/Workshop', 'Vendor Visit', 'Parent Visit'],
  'Call Purpose': ['Admission', 'Student Absence', 'Fee Query', 'Transport Query', 'General Info', 'Complaint'],
  'Call Type': ['General', 'Urgent', 'Follow-up'],
  'Postal Type': ['Official Letter', 'Courier', 'Circular', 'Newspaper/Magazine'],
  'Enquiry Source': ['Walk-in', 'Phone', 'Website', 'Referral', 'Advertisement'],
  'Complaint Type': ['Academic', 'Infrastructure', 'Behavioral', 'Transport']
};

const FrontOfficeSetupPage: React.FC = () => {
  const [formData, setFormData] = useState({
    groupKey: 'Visitor Purpose',
    categoryName: '',
    description: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Category Added:', formData);
    // Logic to add category would go here
    setFormData({ ...formData, categoryName: '', description: '' });
  };

  const groupKeyOptions = [
    { value: 'Visitor Purpose', label: 'Visitor Purpose' },
    { value: 'Call Purpose', label: 'Call Purpose' },
    { value: 'Call Type', label: 'Call Type' },
    { value: 'Postal Type', label: 'Postal Type' },
    { value: 'Enquiry Source', label: 'Enquiry Source' },
    { value: 'Complaint Type', label: 'Complaint Type' },
  ];

  return (
    <div className={styles.pageContainer}>
      <PageHeader 
        title="Front Office Setup" 
        breadcrumbs="Dashboard / Front Office / Setup"
      />

      <div className={styles.setupGrid}>
        {/* Left Column: Add Category Form */}
        <div className={styles.leftColumn}>
            <Card title="Add Category" headerActions={<Settings size={20} className="text-gray-400" />}>
                <form onSubmit={handleSubmit} className={styles.formContainer}>
                    <Select 
                        label="Group Key"
                        name="groupKey"
                        options={groupKeyOptions}
                        value={formData.groupKey}
                        onChange={handleChange}
                        required
                    />
                    <Input 
                        label="Category Name"
                        name="categoryName"
                        value={formData.categoryName}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Admission Enquiry"
                        icon={<Tag size={16} />}
                    />
                    <Input 
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        multiline
                        rows={3}
                        placeholder="Optional description..."
                    />
                    <div className={styles.formActions}>
                        <Button type="submit" icon={<Save size={18} />} fullWidth>
                            Add Category
                        </Button>
                    </div>
                </form>
            </Card>
        </div>

        {/* Right Column: Categories Master List */}
        <div className={styles.rightColumn}>
          <Card title="Categories Master List">
             <div className={styles.masterListContainer}>
                {Object.entries(initialCategories).map(([group, items]) => (
                    <div key={group} className={styles.categoryGroup}>
                        <h3 className={styles.groupTitle}>{group}</h3>
                        <div className={styles.itemsList}>
                            {items.map((item, index) => (
                                <div key={index} className={styles.itemRow}>
                                    <span className={styles.itemName}>{item}</span>
                                    <div className={styles.itemActions}>
                                        <span className={styles.activeBadge}>Active</span>
                                        <div className={styles.actionButtons}>
                                            <button className={styles.iconButton}><Edit size={14} /></button>
                                            <button className={`${styles.iconButton} ${styles.deleteBtn}`}><Trash2 size={14} /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
             </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FrontOfficeSetupPage;
