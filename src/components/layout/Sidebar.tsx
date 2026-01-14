import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Building2, 
  GraduationCap, 
  User, 
  Users, 
  ArrowUpRight, 
  ListOrdered, 
  Calendar, 
  BarChart3, 
  FileText, 
  CalendarClock, 
  ClipboardList, 
  Wallet, 
  Calculator, 
  Receipt, 
  PieChart, 
  Banknote, 
  Layout, 
  Book, 
  BookOpen, 
  Table, 
  BookOpenText, 
  FileEdit, 
  FileQuestion, 
  Monitor, 
  GitBranch, 
  ClipboardCheck, 
  Library, 
  Home, 
  Bus, 
  Mail, 
  MessageSquare, 
  Box, 
  Trophy, 
  Settings,
  ChevronRight,
  School,
  X,
  LucideIcon
} from 'lucide-react';
import styles from './Sidebar.module.css';

interface SubMenuItem {
  label: string;
  path: string;
}

interface MenuItem {
  label: string;
  path: string; // If it has subItems, this might be used as a key or redirect
  icon: LucideIcon;
  subItems?: SubMenuItem[];
}

interface MenuSection {
  section: string;
  items: MenuItem[];
}

const MENU_ITEMS: MenuSection[] = [
  {
    section: 'DASHBOARD',
    items: [
      { label: 'Dashboard', path: '/', icon: LayoutDashboard }
    ]
  },
  {
    section: 'FRONT OFFICE',
    items: [
      { 
        label: 'Front Office', 
        path: '/front-office', 
        icon: Building2, 
        subItems: [
          { label: 'Visitors Log', path: '/front-office/visitors' },
          { label: 'Phone Calls', path: '/front-office/phone-calls' },
          { label: 'Half Day Notices', path: '/front-office/half-day' },
          { label: 'Postal', path: '/front-office/postal' },
          { label: 'Admission Enquiries', path: '/front-office/admission-enquiries' },
          { label: 'Complaints', path: '/front-office/complaints' },
          { label: 'Setup', path: '/front-office/setup' },
        ]
      }
    ]
  },
  {
    section: 'PEOPLES',
    items: [
      { label: 'Students', path: '/students', icon: GraduationCap },
      { label: 'Parents', path: '/parents', icon: User },
      { label: 'Staff', path: '/staff', icon: Users },
      { label: 'Promote Student', path: '/promote-student', icon: ArrowUpRight },
      { label: 'Roll Numbers', path: '/roll-numbers', icon: ListOrdered }
    ]
  },
  {
    section: 'ATTENDANCE',
    items: [
      { label: 'Student Attendance', path: '/attendance/student', icon: Calendar },
      { label: 'Student Attendance Report', path: '/attendance/student-report', icon: BarChart3 },
      { label: 'Half Day Notices', path: '/attendance/notices', icon: FileText },
      { label: 'Staff Attendance', path: '/attendance/staff', icon: CalendarClock },
      { label: 'Staff Attendance Report', path: '/attendance/staff-report', icon: ClipboardList }
    ]
  },
  {
    section: 'FINANCE & ACCOUNTS',
    items: [
      { label: 'Fees Maker', path: '/finance/fees', icon: Wallet, subItems: [] }, // Placeholder
      { label: 'Accounts', path: '/finance/accounts', icon: Calculator, subItems: [] },
      { label: 'Expenses', path: '/finance/expenses', icon: Receipt, subItems: [] },
      { label: 'Fees Report', path: '/finance/report', icon: PieChart, subItems: [] },
      { label: 'Fees Collection', path: '/finance/collection', icon: Banknote, subItems: [] }
    ]
  },
  {
    section: 'ACADEMIC',
    items: [
      { label: 'Class Room', path: '/academic/classrooms', icon: Layout },
      { label: 'Subject', path: '/academic/subjects', icon: Book },
      { label: 'Classes', path: '/academic/classes', icon: BookOpen },
      { label: 'Time Table', path: '/academic/timetable', icon: Table, subItems: [] },
      { label: 'Study Material', path: '/academic/materials', icon: BookOpenText },
      { label: 'Homework', path: '/academic/homework', icon: Book },
      { label: 'Assignments', path: '/academic/assignments', icon: FileEdit },
      { label: 'Question Bank', path: '/academic/questions', icon: FileQuestion },
      { label: 'Online Exam', path: '/academic/online-exam', icon: Monitor }
    ]
  },
  {
    section: 'EXAMINATIONS',
    items: [
      { label: 'Exam Patterns', path: '/exams/patterns', icon: GitBranch },
      { label: 'Examination', path: '/exams/list', icon: ClipboardCheck }
    ]
  },
  {
    section: 'MANAGEMENT',
    items: [
      { label: 'Library', path: '/management/library', icon: Library, subItems: [] },
      { label: 'Hostel', path: '/management/hostel', icon: Home },
      { label: 'Transport', path: '/management/transport', icon: Bus, subItems: [] }
    ]
  },
  {
    section: 'COMMUNICATION',
    items: [
      { label: 'Logs & History', path: '/communication/logs', icon: Mail },
      { label: 'Compose Mail/SMS', path: '/communication/compose', icon: MessageSquare }
    ]
  },
  {
    section: 'INVENTORY',
    items: [
      { label: 'Inventory', path: '/inventory', icon: Box, subItems: [] }
    ]
  },
  {
    section: 'REPORTS',
    items: [
      { label: 'Report', path: '/reports', icon: BarChart3 } // Reusing BarChart3 or PieChart
    ]
  },
  {
    section: 'COMPETITIONS',
    items: [
      { label: 'Competitions', path: '/competitions', icon: Trophy }
    ]
  },
  {
    section: 'SETTINGS',
    items: [
      { label: 'App Settings', path: '/settings', icon: Settings, subItems: [] }
    ]
  }
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['Front Office']); // Default expanded for demo
  const location = useLocation();

  const toggleMenu = (label: string) => {
    setExpandedMenus(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label) 
        : [...prev, label]
    );
  };

  const isExpanded = (label: string) => expandedMenus.includes(label);

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`${styles.overlay} ${isOpen ? styles.showOverlay : ''}`} 
        onClick={onClose}
      />

      <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
        {/* Brand Header */}
        <div className={styles.brand}>
          <div className={styles.brandLogo}>SF</div>
          <div className={styles.brandName}>SF-Software</div>
          {/* Close Button for Mobile */}
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.scrollArea}>
          {/* School Card */}
          <div className={styles.schoolCard}>
            <div className={styles.schoolLogo}>
              <School size={20} color="#4318ff" />
            </div>
            <div className={styles.schoolName}>School Name</div>
          </div>

          {/* Menu Items */}
          {MENU_ITEMS.map((section, index) => (
            <div key={index}>
              <div className={styles.sectionHeader}>
                <span className={styles.sectionTitle}>{section.section}</span>
                <div className={styles.sectionLine}></div>
              </div>
              
              <nav>
                {section.items.map((item, itemIndex) => {
                  const hasSub = item.subItems && item.subItems.length > 0;
                  const expanded = isExpanded(item.label);

                  return (
                    <div key={itemIndex}>
                      {hasSub ? (
                        // Parent Item with Submenu
                        <div 
                          className={`${styles.navItem} ${isActive(item.path) ? styles.active : ''}`}
                          onClick={() => toggleMenu(item.label)}
                        >
                          <div className={styles.navItemContent}>
                            <item.icon className={styles.icon} />
                            <span>{item.label}</span>
                          </div>
                          <ChevronRight 
                            size={16} 
                            className={`${styles.arrowIcon} ${expanded ? styles.rotateArrow : ''}`} 
                          />
                        </div>
                      ) : (
                        // Standard Link Item
                        <NavLink 
                          to={item.path} 
                          className={({ isActive }) => `${styles.navItem} ${isActive ? styles.active : ''}`}
                          onClick={() => {
                            // Close sidebar on mobile when link clicked
                            if (window.innerWidth <= 768) onClose();
                          }}
                        >
                          <div className={styles.navItemContent}>
                            <item.icon className={styles.icon} />
                            <span>{item.label}</span>
                          </div>
                        </NavLink>
                      )}

                      {/* Submenu Rendering */}
                      {hasSub && expanded && (
                        <div className={styles.submenu}>
                          {item.subItems?.map((sub, subIndex) => (
                            <NavLink
                              key={subIndex}
                              to={sub.path}
                              className={({ isActive }) => `${styles.subItem} ${isActive ? styles.active : ''}`}
                              onClick={() => {
                                // Close sidebar on mobile when link clicked
                                if (window.innerWidth <= 768) onClose();
                              }}
                            >
                              {sub.label}
                            </NavLink>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;