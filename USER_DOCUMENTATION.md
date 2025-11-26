# Atomik Pentest Report Generator - User Documentation

## Table of Contents
1. [Overview](#overview)
2. [Getting Started](#getting-started)
3. [Core Features](#core-features)
4. [Technical Architecture](#technical-architecture)
5. [User Workflows](#user-workflows)
6. [Data Management](#data-management)

---

## Overview

**Atomik** is a modern, full-featured penetration testing report generation platform designed to streamline the workflow of security professionals. Built with React, TypeScript, and a premium dark-mode-first design, Atomik helps pentesters manage clients, projects, findings, and generate professional reports.

### Key Capabilities
- **Client Management**: Track client organizations with detailed contact and classification information
- **Project Management**: Organize pentesting engagements with multiple view modes
- **Findings Database**: Browse and customize vulnerability findings from standard databases
- **Report Generation**: Create professional pentest reports with customizable templates
- **Theme Support**: Light, dark, and system-adaptive themes
- **Data Persistence**: All data saved locally with localStorage

---

## Getting Started

### Login & Authentication

The application supports two deployment modes:

**Docker Mode (Web)**
- Navigate to the login page
- Use demo credentials or configured authentication
- Click "Sign In" to access the dashboard

**Desktop Mode**
- Enter your license key on the license entry screen
- Validate and proceed to the main application

### Dashboard Overview

The dashboard provides a high-level overview of your penetration testing operations:

**Metric Cards** (Theme-Adaptive)
- **Total Clients**: Number of client organizations
- **Total Projects**: Active and completed projects
- **Active Projects**: Currently in-progress engagements
- **Total Findings**: Cumulative vulnerability count
- **Critical Findings**: High-severity issues requiring immediate attention
- **Completed Projects**: Successfully finished engagements

Each card features:
- Gradient accent borders
- Trend indicators (↑ +12%, ↓ -5%)
- Hover animations
- Light/dark theme support

---

## Core Features

### 1. Client Management

#### Client List Views

**Card View**
- Visual grid layout with client logos/emojis
- Quick stats: Projects, Reports, Findings
- Status badges (Active, Prospect, Inactive, Archived)
- Industry and company size indicators

**Table View**
- Sortable columns (Name, Contact, Projects, Reports, Findings, Last Activity)
- Click column headers to sort ascending/descending
- Compact data presentation
- Quick action buttons

**List View**
- Detailed row-based layout
- Full contact information visible
- Risk level indicators
- Tag display

#### Adding a New Client

The Add Client dialog uses a **3-step wizard**:

**Step 1: Basic Info**
- Company Name (required)
- Industry
- Company Size (Startup/SMB/Enterprise)
- Logo URL or Emoji

**Step 2: Contact**
- Primary Contact Name (required)
- Email Address (required)
- Phone Number
- Notes

**Step 3: Classification**
- Client Status (Prospect, Active, Inactive, Archived)
- Risk Level (Low, Medium, High)
- Tags (PCI, SOC2, etc.)

**Features:**
- Perfectly symmetric stepper with progress indicators
- Form validation
- Real-time preview
- Data persistence to localStorage

#### Client Actions

**View Details**
- Opens comprehensive modal with:
  - Contact information
  - Company details
  - Associated projects
  - Reports generated
  - Findings summary
  - Activity timeline

**Edit Client**
- Pre-populated form with existing data
- Same 3-step wizard interface
- Updates saved to localStorage

**Delete Client**
- Confirmation dialog
- Removes client and associated data

### 2. Project Management

#### Project List Views

**Card View**
- Project cards with:
  - Project name and client
  - Status and priority badges
  - Progress bar
  - Timeline dates
  - Findings summary (Critical, High, Medium counts)
- Simplified design (removed emojis and team members for cleaner look)

**Table View**
- Sortable columns:
  - Project Name
  - Client
  - Status
  - Priority
  - Progress
  - Timeline
  - Team Lead
- Click headers to toggle sort direction
- Visual sort indicators (↑↓)

**Timeline View**
- Chronological project layout
- Visual timeline representation
- Milestone tracking
- Gantt-style display

#### Adding a New Project

The Add Project dialog uses a **4-step wizard**:

**Step 1: Basic Information**
- Project Name (required)
- Client Selection (dropdown)
- Project Type (Web App, Mobile, Network, Cloud, API)
- Testing Methodology (OWASP Testing Guide v4 - default, PTES, NIST, Custom)

**Step 2: Scope & Timeline**
- Start Date (calendar picker)
- End Date (calendar picker)
- Scope Items (multi-entry)
- Out of Scope Items

**Step 3: Team & Compliance**
- Lead Tester (required)
- Team Members (multi-select)
- Compliance Frameworks (PCI-DSS, HIPAA, SOC 2, ISO 27001, GDPR)

**Step 4: Additional Details**
- Project Description
- Special Requirements
- Notes

**Features:**
- Calendar date picker with visual selection
- Dynamic scope management
- Team member assignment
- Compliance framework selection
- Data persistence

#### Project Actions

**View Details**
- Comprehensive modal showing:
  - Project metadata
  - Client information
  - Timeline and progress
  - Methodology and compliance
  - Team composition
  - Scope details
  - Findings summary

**Edit Project**
- Pre-populated 4-step wizard
- Modify any project attribute
- Updates reflected immediately

**Generate Report**
- Navigate to Report Builder
- Pre-select project
- Initiate report generation workflow

**Delete Project**
- Confirmation dialog
- Removes project data

#### Filtering & Search

**Search**
- Real-time search across:
  - Project names
  - Client names
  - Project types
  - Compliance frameworks

**Filters**
- Status (Planning, Active, Completed, On Hold)
- Priority (Critical, High, Medium, Low)
- Type (Web App, Mobile, Network, etc.)
- Date Range
- Compliance Framework

**Active Filters Display**
- Visual chips showing applied filters
- One-click removal
- Clear all option

### 3. Findings Management

#### Findings Database

**Browse Standard Vulnerabilities**
- Pre-loaded vulnerability database
- Categories: Web, Mobile, Network, Cloud, Database
- Severity levels: Critical, High, Medium, Low, Info
- OWASP references

**Search & Filter**
- Real-time search across:
  - Vulnerability titles
  - Descriptions
  - OWASP references
- Filter by:
  - Category
  - Severity

**Findings Display**
- Card-based layout
- Color-coded severity badges
- Category icons
- OWASP reference tags
- Description preview

#### Adding Custom Findings

**Add Custom Finding Dialog**
- Title (required)
- Severity (Critical, High, Medium, Low, Info)
- Category (Web, Mobile, Network, Cloud, Database, Other)
- Description (required)
- Remediation (required)
- OWASP Reference (optional)

**Features:**
- Form validation
- Persistent storage
- Merged with standard database
- Toast notifications

#### Importing Findings

**Import from External Scanners**
- Click "Import Findings" button
- Select file (.xml, .csv, .json)
- Automatic parsing (simulated)
- Success notification
- Findings added to database

**Supported Formats:**
- XML (scanner output)
- CSV (spreadsheet exports)
- JSON (API responses)

### 4. Report Builder

**Report Selection**
- List of available reports
- Project association
- Status indicators
- Last modified dates

**Report Details View**
- Report metadata
- Findings count
- Severity breakdown
- Generation status

**Report Generation**
- Select project
- Choose template
- Configure sections
- Generate PDF/DOCX

### 5. Settings

#### Theme Management

**Theme Options**
- **Light Mode**: Clean white backgrounds, dark text
- **Dark Mode**: Rich dark backgrounds, light text
- **System**: Follows OS preference

**Theme Features:**
- Instant switching
- Persistent preference
- Adaptive UI components
- Optimized contrast ratios

#### User Profile

- Name
- Email
- Role
- Organization

#### Application Settings

- Default methodology
- Date format
- Export preferences
- Notification settings

---

## Technical Architecture

### Frontend Stack

**Core Technologies**
- **React 18**: UI framework
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **React Router**: Client-side routing

**UI Framework**
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: Component library
- **Radix UI**: Accessible primitives
- **Lucide React**: Icon system

**State Management**
- **Zustand**: Lightweight state management
- **localStorage**: Data persistence

**Form Handling**
- **React Hook Form**: Form state management
- **Zod**: Schema validation

**Date Handling**
- **date-fns**: Date manipulation and formatting

### Component Architecture

**Layout Components**
- `Layout.tsx`: Main application shell with sidebar
- `StatCard.tsx`: Reusable metric cards with theme support

**Page Components**
- `Dashboard.tsx`: Overview metrics
- `Clients.tsx`: Client management
- `Projects.tsx`: Project management
- `Findings.tsx`: Vulnerability database
- `ReportBuilder.tsx`: Report generation
- `Settings.tsx`: Application configuration

**Dialog Components**
- `AddClientDialog.tsx`: 3-step client creation wizard
- `AddProjectDialog.tsx`: 4-step project creation wizard
- `AddFindingDialog.tsx`: Custom finding form
- `ClientDetailModal.tsx`: Client details view
- `ProjectDetailModal.tsx`: Project details view
- `FilterDialog.tsx`: Reusable filter interface

**UI Components** (shadcn/ui)
- `Button`, `Input`, `Textarea`
- `Card`, `Badge`, `Avatar`
- `Dialog`, `AlertDialog`
- `DropdownMenu`, `Select`
- `Calendar`, `ScrollArea`
- `Toast`, `Toaster`

### Data Models

**Client Interface**
```typescript
interface Client {
  id: string
  name: string
  industry: string
  companySize: 'Enterprise' | 'SMB' | 'Startup'
  logoUrl: string
  primaryContact: string
  email: string
  phone: string
  status: 'Active' | 'Inactive' | 'Prospect' | 'Archived'
  riskLevel: 'High' | 'Medium' | 'Low'
  tags: string[]
  notes: string
  lastActivity: string
  lastActivityDate: Date
  projectsCount: number
  reportsCount: number
  totalFindings: number
  findingsBySeverity: {
    critical: number
    high: number
    medium: number
    low: number
  }
  createdAt: Date
  updatedAt: Date
}
```

**Project Interface**
```typescript
interface Project {
  id: string
  name: string
  clientName: string
  clientId: string
  clientLogoUrl: string
  type: 'Web App' | 'Mobile' | 'Network' | 'Cloud' | 'API' | 'Other'
  status: 'Planning' | 'Active' | 'Completed' | 'On Hold'
  priority: 'Critical' | 'High' | 'Medium' | 'Low'
  progress: number
  startDate: Date
  endDate: Date
  leadTester: string
  teamMembers: TeamMember[]
  methodology: string
  complianceFrameworks: string[]
  scope: string[]
  outOfScope: string[]
  description: string
  specialRequirements: string
  notes: string
  findingsBySeverity: {
    critical: number
    high: number
    medium: number
    low: number
  }
  createdAt: Date
  updatedAt: Date
}
```

**Finding Interface**
```typescript
interface Finding {
  id: string
  title: string
  severity: 'Critical' | 'High' | 'Medium' | 'Low' | 'Info'
  category: 'Web' | 'Mobile' | 'Network' | 'Cloud' | 'Database' | 'Other'
  description: string
  remediation: string
  owasp_reference: string
}
```

### Data Persistence

**localStorage Keys**
- `clients`: Array of client objects
- `projects`: Array of project objects
- `customFindings`: Array of custom findings
- `clientsViewMode`: Preferred view mode (card/table/list)
- `projectsViewMode`: Preferred view mode (card/table/timeline)
- `theme`: Theme preference (light/dark/system)

**Persistence Strategy**
- Automatic save on state changes
- Load on component mount
- Date serialization/deserialization
- Error handling with fallback to defaults

### Theme System

**Implementation**
- Tailwind CSS dark mode with class strategy
- Zustand store for theme state
- System preference detection
- Persistent theme selection

**Theme Classes**
```css
/* Light Mode */
bg-white text-gray-900

/* Dark Mode */
dark:bg-gray-900 dark:text-white

/* Adaptive Components */
bg-white dark:bg-[#1a1d21]
border-gray-200 dark:border-gray-800
text-gray-600 dark:text-gray-400
```

---

## User Workflows

### Workflow 1: Onboarding a New Client

1. Navigate to **Clients** page
2. Click **"+ Add Client"** button
3. **Step 1**: Enter company details
   - Company name
   - Industry
   - Company size
   - Logo/emoji
4. **Step 2**: Add contact information
   - Primary contact name
   - Email address
   - Phone number
   - Notes
5. **Step 3**: Set classification
   - Client status (e.g., "Prospect")
   - Risk level
   - Tags (e.g., "PCI", "SOC2")
6. Click **"Create Client"**
7. Client appears in the list
8. Data automatically saved to localStorage

### Workflow 2: Creating a Penetration Test Project

1. Navigate to **Projects** page
2. Click **"+ New Project"** button
3. **Step 1**: Enter basic information
   - Project name
   - Select client from dropdown
   - Choose project type
   - Select methodology (default: OWASP Testing Guide v4)
4. **Step 2**: Define scope and timeline
   - Set start and end dates using calendar picker
   - Add in-scope items
   - Add out-of-scope items
5. **Step 3**: Assign team and compliance
   - Select lead tester
   - Add team members
   - Choose compliance frameworks
6. **Step 4**: Add additional details
   - Project description
   - Special requirements
   - Notes
7. Click **"Create Project"**
8. Project appears in the list with 0% progress
9. Data automatically saved to localStorage

### Workflow 3: Managing Findings

1. Navigate to **Findings** page
2. **Browse standard vulnerabilities**:
   - Use search to find specific vulnerabilities
   - Filter by category or severity
   - Click on a finding to view details
3. **Add custom finding**:
   - Click **"Add Custom Finding"**
   - Fill in finding details
   - Click **"Add Finding"**
   - Toast notification confirms success
4. **Import findings**:
   - Click **"Import Findings"**
   - Select .xml, .csv, or .json file
   - Findings automatically parsed and added
   - Toast notification shows import status

### Workflow 4: Generating a Report

1. Navigate to **Projects** page
2. Locate the project for reporting
3. Click the **"..."** menu on the project card
4. Select **"Generate Report"**
5. System navigates to Report Builder
6. Project is pre-selected
7. Configure report sections
8. Click **"Generate"**
9. Report is created and available for download

### Workflow 5: Viewing Project Details

1. Navigate to **Projects** page
2. Click **"View Details"** (eye icon) on any project
3. Modal displays:
   - Project header with status and priority
   - Progress bar
   - Timeline information
   - Methodology and compliance
   - Team members
   - Scope details
   - Findings summary
4. Action buttons available:
   - **Edit Project**: Opens edit dialog
   - **Generate Report**: Navigates to report builder
   - **Delete Project**: Shows confirmation dialog

### Workflow 6: Switching Themes

1. Navigate to **Settings** page
2. Locate **"Appearance"** section
3. Click theme option:
   - **Light**: Activates light mode
   - **Dark**: Activates dark mode
   - **System**: Follows OS preference
4. Theme changes immediately
5. Preference saved to localStorage
6. All components adapt:
   - Stat cards
   - Dialogs
   - Tables
   - Badges
   - Text colors

---

## Data Management

### Data Storage

**Client-Side Storage**
- All data stored in browser localStorage
- No server-side database required
- Instant read/write operations
- Survives page refreshes

**Data Structure**
```javascript
// localStorage.clients
[
  {
    id: "1234567890",
    name: "Acme Corporation",
    // ... other client fields
  }
]

// localStorage.projects
[
  {
    id: "0987654321",
    name: "Q1 2024 External Penetration Test",
    // ... other project fields
  }
]

// localStorage.customFindings
[
  {
    id: "custom-1234567890",
    title: "Custom SQL Injection",
    // ... other finding fields
  }
]
```

### Data Synchronization

**State Management Flow**
1. Component mounts
2. Load data from localStorage
3. Parse JSON and deserialize dates
4. Initialize component state
5. User makes changes
6. State updates trigger useEffect
7. Serialize data to JSON
8. Save to localStorage
9. Data persists across sessions

**Error Handling**
- Try/catch blocks for JSON parsing
- Fallback to default/mock data on error
- Console logging for debugging
- Graceful degradation

### Data Export

**Export Options** (Future Enhancement)
- Export clients as CSV
- Export projects as JSON
- Export findings as XML
- Backup all data as ZIP

### Data Import

**Import Capabilities**
- Import findings from scanner output
- Supported formats: XML, CSV, JSON
- Automatic field mapping
- Duplicate detection

---

## Best Practices

### Performance Optimization

1. **Use View Modes Appropriately**
   - Card view: Visual overview (best for ≤20 items)
   - Table view: Dense data (best for sorting/filtering)
   - List view: Detailed information (best for comprehensive review)

2. **Leverage Search and Filters**
   - Use search for quick lookups
   - Apply filters to narrow results
   - Clear filters when done

3. **Organize with Tags**
   - Tag clients by compliance needs
   - Tag projects by engagement type
   - Use consistent tag naming

### Data Hygiene

1. **Regular Updates**
   - Update project progress regularly
   - Mark completed projects as "Completed"
   - Archive inactive clients

2. **Consistent Naming**
   - Use clear, descriptive project names
   - Include client name in project title
   - Follow naming conventions

3. **Backup Strategy**
   - Periodically export data
   - Store backups externally
   - Test restore procedures

---

## Keyboard Shortcuts (Future Enhancement)

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + K` | Quick search |
| `Ctrl/Cmd + N` | New client/project |
| `Ctrl/Cmd + F` | Open filters |
| `Ctrl/Cmd + ,` | Open settings |
| `Esc` | Close dialog/modal |

---

## Troubleshooting

### Common Issues

**Issue: Data not persisting**
- **Solution**: Check browser localStorage is enabled
- **Solution**: Clear browser cache and reload
- **Solution**: Check for localStorage quota exceeded

**Issue: Theme not switching**
- **Solution**: Hard refresh the page (Ctrl+Shift+R)
- **Solution**: Clear localStorage and reset theme

**Issue: Dates not displaying correctly**
- **Solution**: Check browser timezone settings
- **Solution**: Verify date format in settings

**Issue: Blank screen on Clients page**
- **Solution**: Check browser console for errors
- **Solution**: Clear localStorage and reload
- **Solution**: Verify React import statements

---

## Future Enhancements

### Planned Features

1. **Backend Integration**
   - PostgreSQL database
   - RESTful API
   - Multi-user support
   - Role-based access control

2. **Advanced Reporting**
   - Custom report templates
   - Executive summary generation
   - Automated remediation tracking
   - Report versioning

3. **Collaboration**
   - Real-time collaboration
   - Comments and annotations
   - Task assignment
   - Activity feeds

4. **Integrations**
   - Burp Suite integration
   - Nessus import
   - Metasploit integration
   - JIRA ticket creation

5. **Analytics**
   - Dashboard analytics
   - Trend analysis
   - Client risk scoring
   - Finding statistics

---

## Support & Resources

### Documentation
- User Guide: This document
- API Documentation: Coming soon
- Video Tutorials: Coming soon

### Community
- GitHub Issues: Report bugs and feature requests
- Discord Server: Community support
- Email Support: support@atomik.io

### Version Information
- Current Version: 1.0.0
- Last Updated: 2024-11-24
- License: Proprietary

---

**© 2024 Atomik. All rights reserved.**
