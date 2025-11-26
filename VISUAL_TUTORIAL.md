# Atomik Pentest Report Generator - Visual Tutorial Guide

## Quick Start Guide with Screenshots

This visual guide walks you through the key features of Atomik with screenshots and step-by-step instructions.

---

## 1. Login & Dashboard

### Logging In

![Login Screen](/Users/iriof/.gemini/antigravity/brain/ec082124-9b89-4714-9890-4e7ff5136e8f/login_page_1763919972730.png)

**Steps:**
1. Enter your credentials
2. Click "Sign In"
3. Access the dashboard

### Dashboard Overview

![Dashboard](/Users/iriof/.gemini/antigravity/brain/ec082124-9b89-4714-9890-4e7ff5136e8f/dashboard_view_1763920227558.png)

The dashboard shows:
- **Total Clients**: 5 clients (+12% trend)
- **Total Projects**: 8 projects (+15% trend)
- **Active Projects**: 2 ongoing engagements (+12% trend)
- **Total Reports**: 0 reports (-5% trend)
- **Total Findings**: 15 vulnerabilities
- **Completed Projects**: 6 finished engagements (+12% trend)

---

## 2. Client Management

### Clients Page - Card View

![Clients Card View](/Users/iriof/.gemini/antigravity/brain/ec082124-9b89-4714-9890-4e7ff5136e8f/clients_card_view_1763921706888.png)

**Features:**
- Visual grid layout
- Client logos/emojis
- Quick stats (Projects, Reports, Findings)
- Status badges
- Action menu (View, Edit, Delete)

### Clients Page - Table View

![Clients Table View](/Users/iriof/.gemini/antigravity/brain/ec082124-9b89-4714-9890-4e7ff5136e8f/clients_table_view_1763921728472.png)

**Features:**
- Sortable columns
- Compact data display
- Click headers to sort
- Quick actions

### Clients Page - List View

![Clients List View](/Users/iriof/.gemini/antigravity/brain/ec082124-9b89-4714-9890-4e7ff5136e8f/clients_list_view_1763921747942.png)

**Features:**
- Detailed row layout
- Full contact information
- Risk indicators
- Tag display

### Adding a New Client

#### Step 1: Basic Information

![Add Client Step 1](/Users/iriof/.gemini/antigravity/brain/ec082124-9b89-4714-9890-4e7ff5136e8f/add_client_step1_1763930289644.png)

**Enter:**
- Company Name (required)
- Industry
- Company Size
- Logo/Emoji

#### Step 2: Contact Information

![Add Client Step 2](/Users/iriof/.gemini/antigravity/brain/ec082124-9b89-4714-9890-4e7ff5136e8f/add_client_step2_1763930314826.png)

**Enter:**
- Primary Contact (required)
- Email Address (required)
- Phone Number
- Notes

#### Step 3: Classification

![Add Client Step 3](/Users/iriof/.gemini/antigravity/brain/ec082124-9b89-4714-9890-4e7ff5136e8f/add_client_step3_1763930368903.png)

**Configure:**
- Client Status (Prospect, Active, Inactive, Archived)
- Risk Level (Low, Medium, High)
- Tags (PCI, SOC2, etc.)

### Client Detail Modal

![Client Detail Modal](/Users/iriof/.gemini/antigravity/brain/ec082124-9b89-4714-9890-4e7ff5136e8f/client_detail_modal_buttons_1763958074754.png)

**Shows:**
- Contact information
- Company details
- Projects list
- Reports generated
- Findings summary
- Action buttons (Edit, Delete)

---

## 3. Project Management

### Projects Page - Card View

![Projects Card View](/Users/iriof/.gemini/antigravity/brain/ec082124-9b89-4714-9890-4e7ff5136e8f/projects_screen_top_1763932173559.png)

**Features:**
- Clean card design (no emojis/team avatars)
- Project name and client
- Status and priority badges
- Progress bar
- Timeline dates
- Findings summary (C/H/M counts)

![Projects Bottom](/Users/iriof/.gemini/antigravity/brain/ec082124-9b89-4714-9890-4e7ff5136e8f/projects_screen_bottom_1763932180454.png)

### Projects Page - Table View

![Projects Table View](/Users/iriof/.gemini/antigravity/brain/ec082124-9b89-4714-9890-4e7ff5136e8f/projects_table_view_fixed_1763935012004.png)

**Features:**
- Sortable columns (click headers)
- Sort indicators (↑↓)
- Compact data display
- Quick actions

### Projects Page - Timeline View

![Projects Timeline View](/Users/iriof/.gemini/antigravity/brain/ec082124-9b89-4714-9890-4e7ff5136e8f/projects_timeline_view_1763934787777.png)

**Features:**
- Chronological layout
- Visual timeline
- Milestone tracking
- Hover effects

![Timeline Hover](/Users/iriof/.gemini/antigravity/brain/ec082124-9b89-4714-9890-4e7ff5136e8f/projects_timeline_hover_1763934800577.png)

### Adding a New Project

#### Step 1: Basic Information

![Add Project Step 1](/Users/iriof/.gemini/antigravity/brain/ec082124-9b89-4714-9890-4e7ff5136e8f/add_project_step1_1763932683859.png)

**Enter:**
- Project Name (required)
- Client Selection
- Project Type
- Testing Methodology (OWASP default)

#### Step 2: Scope & Timeline

![Add Project Step 2](/Users/iriof/.gemini/antigravity/brain/ec082124-9b89-4714-9890-4e7ff5136e8f/add_project_step2_1763932733184.png)

**Configure:**
- Start Date (calendar picker)
- End Date (calendar picker)
- In-Scope Items
- Out-of-Scope Items

#### Step 3: Team & Compliance

![Add Project Step 3](/Users/iriof/.gemini/antigravity/brain/ec082124-9b89-4714-9890-4e7ff5136e8f/add_project_step3_1763932781811.png)

**Assign:**
- Lead Tester (required)
- Team Members
- Compliance Frameworks

#### Step 4: Additional Details

![Add Project Step 4](/Users/iriof/.gemini/antigravity/brain/ec082124-9b89-4714-9890-4e7ff5136e8f/add_project_step4_1763932822278.png)

**Add:**
- Project Description
- Special Requirements
- Notes

#### Project Added Successfully

![Project Added](/Users/iriof/.gemini/antigravity/brain/ec082124-9b89-4714-9890-4e7ff5136e8f/project_added_final_1763932847409.png)

---

## 4. Findings Management

### Findings Database

![Findings Page](/Users/iriof/.gemini/antigravity/brain/ec082124-9b89-4714-9890-4e7ff5136e8f/findings_fixed_1763961988425.png)

**Features:**
- Browse standard vulnerabilities
- Search across titles, descriptions, OWASP refs
- Filter by category and severity
- Color-coded severity badges
- Category icons
- "Add Custom Finding" button
- "Import Findings" button

**Severity Colors:**
- 🔴 Critical: Red
- 🟠 High: Orange
- 🟡 Medium: Yellow
- 🟢 Low: Green
- 🔵 Info: Blue

---

## 5. Settings & Theme Management

### Settings Page - Light Mode

![Settings Light](/Users/iriof/.gemini/antigravity/brain/ec082124-9b89-4714-9890-4e7ff5136e8f/settings_page_light_1763941652449.png)

**Light Mode Features:**
- Clean white backgrounds
- Dark text for readability
- Subtle shadows
- Professional appearance

### Settings Page - Dark Mode

![Settings Dark](/Users/iriof/.gemini/antigravity/brain/ec082124-9b89-4714-9890-4e7ff5136e8f/settings_page_dark_1763941618630.png)

**Dark Mode Features:**
- Rich dark backgrounds
- Light text
- Reduced eye strain
- Premium aesthetic

### Theme-Aware Dashboard Cards

````carousel
![Light Mode Dashboard](/Users/iriof/.gemini/antigravity/brain/ec082124-9b89-4714-9890-4e7ff5136e8f/uploaded_image_0_1764035753716.png)
<!-- slide -->
![Dark Mode Dashboard](/Users/iriof/.gemini/antigravity/brain/ec082124-9b89-4714-9890-4e7ff5136e8f/uploaded_image_2_1764035753716.png)
````

**Adaptive Features:**
- Stat cards change background colors
- Text colors adjust for contrast
- Borders adapt to theme
- Icons remain visible
- Trend badges stay readable

---

## 6. Key UI Improvements

### Enhanced Stats Cards

![Enhanced Stats](/Users/iriof/.gemini/antigravity/brain/ec082124-9b89-4714-9890-4e7ff5136e8f/enhanced_stats_cards_1763924240917.png)

**Features:**
- Gradient accent borders
- Hover animations
- Trend indicators
- Icon backgrounds
- Theme-adaptive

### Symmetric Stepper Design

![Symmetric Stepper](/Users/iriof/.gemini/antigravity/brain/ec082124-9b89-4714-9890-4e7ff5136e8f/uploaded_image_1_1764034118549.png)

**Features:**
- Perfectly aligned steps
- Equal spacing
- Progress indicators
- Active step highlighting
- Smooth transitions

### Simplified Project Cards

**Before:** Cards had emojis and team member avatars
**After:** Clean, focused design with essential info only

![Simplified Cards](/Users/iriof/.gemini/antigravity/brain/ec082124-9b89-4714-9890-4e7ff5136e8f/uploaded_image_0_1764031778583.png)

---

## 7. Common Workflows

### Workflow: Creating a Client and Project

1. **Add Client**
   - Click "+ Add Client"
   - Complete 3-step wizard
   - Client saved automatically

2. **Create Project**
   - Click "+ New Project"
   - Select the new client
   - Complete 4-step wizard
   - Project appears in list

3. **View Project Details**
   - Click eye icon on project card
   - Review all project information
   - Access action buttons

### Workflow: Managing Findings

1. **Browse Database**
   - Navigate to Findings page
   - Use search and filters
   - Review vulnerability details

2. **Add Custom Finding**
   - Click "Add Custom Finding"
   - Fill in details
   - Save to database

3. **Import from Scanner**
   - Click "Import Findings"
   - Select XML/CSV file
   - Findings added automatically

---

## 8. Tips & Best Practices

### Navigation Tips

**Sidebar Navigation**
- Click logo to return to Dashboard
- Use sidebar links for quick access
- Current page highlighted in sidebar

**View Switching**
- Use view mode buttons (Card/Table/List)
- Preference saved automatically
- Choose based on task:
  - Card: Visual overview
  - Table: Sorting/filtering
  - List: Detailed review

### Data Management Tips

**Organization**
- Use consistent naming conventions
- Tag clients by compliance needs
- Update project progress regularly
- Archive completed work

**Search & Filter**
- Use search for quick lookups
- Combine filters for precision
- Clear filters when done

### Theme Tips

**Choosing a Theme**
- **Light**: Best for bright environments
- **Dark**: Reduces eye strain in low light
- **System**: Adapts to OS preference

**Theme Switching**
- Go to Settings → Appearance
- Select preferred theme
- Changes apply immediately
- Preference persists

---

## 9. Troubleshooting

### Issue: Data Not Saving

**Solution:**
1. Check browser localStorage is enabled
2. Clear browser cache
3. Reload the page
4. Re-enter data

### Issue: Theme Not Switching

**Solution:**
1. Hard refresh (Ctrl+Shift+R)
2. Clear localStorage
3. Reset theme in Settings

### Issue: Blank Screen

**Solution:**
1. Check browser console for errors
2. Clear localStorage
3. Reload application
4. Contact support if persists

---

## 10. Keyboard Shortcuts (Coming Soon)

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + K` | Quick search |
| `Ctrl/Cmd + N` | New item |
| `Ctrl/Cmd + F` | Open filters |
| `Ctrl/Cmd + ,` | Settings |
| `Esc` | Close dialog |

---

## Support

**Need Help?**
- 📧 Email: support@atomik.io
- 💬 Discord: Join our community
- 📖 Docs: Full documentation available
- 🐛 GitHub: Report issues

---

**© 2024 Atomik. All rights reserved.**
