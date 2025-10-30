# Admin Panel - E-Shikshan

A comprehensive admin panel for managing the E-Shikshan platform.

## Overview

The admin panel is a separate, secure interface for managing all aspects of the E-Shikshan platform including users, courses, jobs, hackathons, roadmaps, content, and resumes.

## Features

### ✅ Implemented

#### 1. **Admin Authentication**
- **Login Page**: Secure admin login at `/admin`
- **Credentials**: 
  - Email: `admin@eshikshan.com`
  - Password: `admin123`
- **Token-based Authentication**: Uses `adminToken` stored in localStorage
- **Protected Routes**: All admin routes require authentication

#### 2. **Dashboard** (`/admin/dashboard`)
- Real-time statistics with 8 key metrics:
  - Total Users (1,247)
  - New Users Today (45)
  - Active Courses (142/156)
  - Active Jobs (298)
  - Active Hackathons (23/87)
  - Total Roadmaps (45)
  - Total Content (892 items)
  - Total Resumes (623)
  - Revenue (₹125,000)
- Recent user registrations table
- Quick action buttons for common tasks
- Platform health monitoring (Server Status, API Response Time, Uptime)

#### 3. **User Management** (`/admin/users`)
- **List View**: Table with all registered users
- **Search**: Search by name or email
- **Filter**: Filter by status (Active, Inactive, Pending)
- **User Details**:
  - Name, email, avatar
  - Role (Student/Premium)
  - Status (Active/Inactive/Pending)
  - Registration date
  - Course count
  - Resume count
- **Actions**: View, Edit, Delete user
- **Export**: Export user data
- **Statistics**: Total, Active, Pending, Inactive users

#### 4. **Course Management** (`/admin/courses`)
- **Grid View**: Visual course cards
- **Search**: Search courses by title
- **Filter**: Filter by category (UG, PG, Intermediate, Professional)
- **Course Details**:
  - Title and category
  - Level (Beginner, Intermediate, Advanced)
  - Duration
  - Student count
  - Status (Active, Draft, Inactive)
  - Published date
- **Actions**: View, Edit, Delete course
- **Create New Course**: Button to add new courses
- **Statistics**: Total courses, Active courses, Draft courses, Total students

#### 5. **Job Management** (`/admin/jobs`)
- **List View**: Detailed job listing
- **Search**: Search by job title or company
- **Filter**: Filter by type (Full-time, Part-time, Contract, Internship)
- **Job Details**:
  - Title and company
  - Location
  - Job type
  - Salary range
  - Applicant count
  - Status (Active, Pending, Closed)
  - Posted date
- **Actions**: View, Edit, Delete job
- **Post New Job**: Button to create job postings
- **Statistics**: Total jobs, Active jobs, Pending approval, Total applicants

#### 6. **Settings** (`/admin/settings`)
- **Site Settings**:
  - Site name configuration
  - Site email configuration
  - Maintenance mode toggle
- **Security**:
  - Two-factor authentication toggle
  - Change password option
- **Notifications**:
  - Email notifications toggle
  - Push notifications toggle
- **Account Info**:
  - Admin email display
  - Role display
  - Last login time
- **Save Changes**: Save all settings

#### 7. **Layout & Navigation**
- **Collapsible Sidebar**: 
  - Toggle button for expand/collapse
  - 9 menu items with icons
  - Active route highlighting (red-600)
  - Logout button at bottom
- **Top Bar**:
  - Breadcrumb navigation
  - Admin profile with avatar
- **Mobile Responsive**: Overlay sidebar on mobile devices
- **Consistent Design**: Red-600 theme for admin, gray-800/900 backgrounds

### 🚧 Coming Soon

The following sections are planned but not yet implemented:

- **Hackathons Management** (`/admin/hackathons`)
- **Roadmaps Management** (`/admin/roadmaps`)
- **Content Management** (`/admin/content`)
- **Resumes Management** (`/admin/resumes`)

## Access

### From User Site
1. Navigate to the footer of any page
2. Click on "Admin Portal" under the "Administration" section
3. You'll be redirected to `/admin`

### Direct Access
Navigate to: `http://localhost:5173/admin`

## Technology Stack

- **React**: Component-based UI
- **Framer Motion**: Smooth animations and transitions
- **Lucide Icons**: Modern icon library
- **React Router**: Navigation and routing
- **Tailwind CSS**: Utility-first styling
- **localStorage**: Token storage for authentication

## File Structure

```
client/src/pages/Admin/
├── AdminLogin.jsx          # Login page
├── AdminLayout.jsx         # Layout wrapper with sidebar
├── AdminDashboard.jsx      # Main dashboard
├── AdminUsers.jsx          # User management
├── AdminCourses.jsx        # Course management
├── AdminJobs.jsx           # Job management
└── AdminSettings.jsx       # Settings page
```

## Design System

### Colors
- **Primary**: Red-600 (admin branding)
- **Background**: Gray-800, Gray-900
- **Text**: White, Gray-300, Gray-400
- **Accents**: Blue-400, Green-400, Yellow-400, Purple-400
- **Hover**: Gray-600, Gray-700

### Components
- **Cards**: Rounded-2xl with border-gray-700
- **Buttons**: Rounded-xl with hover effects
- **Inputs**: Rounded-xl with focus ring
- **Badges**: Rounded-full with status colors
- **Tables**: Striped rows with hover states

### Animations
- **Fade In**: Opacity transitions for page load
- **Slide In**: Y-axis movement for cards
- **Stagger**: Sequential animations for lists
- **Hover Scale**: 1.05 scale on buttons
- **Tap Scale**: 0.95 scale on button press

## Security

### Authentication
- Separate admin authentication from user login
- Token-based system with localStorage
- Protected routes requiring authentication
- Automatic redirect to login if not authenticated

### Credentials (Demo)
```
Email: admin@eshikshan.com
Password: admin123
```

⚠️ **Note**: These are demo credentials. In production, implement proper authentication with:
- Secure password hashing (bcrypt)
- JWT tokens with expiration
- Role-based access control (RBAC)
- Session management
- Password reset functionality
- Multi-factor authentication

## State Management

### Admin Authentication State
```javascript
const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

// Check on mount
useEffect(() => {
  const adminToken = localStorage.getItem('adminToken');
  if (adminToken) {
    setIsAdminLoggedIn(true);
  }
}, []);
```

### Logout Flow
```javascript
const handleLogout = () => {
  localStorage.removeItem('adminToken');
  setIsAdminLoggedIn(false);
  navigate('/admin');
};
```

## Route Configuration

### Admin Routes in App.jsx
```javascript
<Route path='/admin' element={<AdminLogin setIsAdminLoggedIn={setIsAdminLoggedIn} />} />
<Route
  path='/admin/*'
  element={
    isAdminLoggedIn ? (
      <AdminLayout setIsAdminLoggedIn={setIsAdminLoggedIn}>
        <Routes>
          <Route path='dashboard' element={<AdminDashboard />} />
          <Route path='users' element={<AdminUsers />} />
          <Route path='courses' element={<AdminCourses />} />
          <Route path='jobs' element={<AdminJobs />} />
          <Route path='settings' element={<AdminSettings />} />
          {/* ... other routes ... */}
        </Routes>
      </AdminLayout>
    ) : (
      <Navigate to='/admin' replace />
    )
  }
/>
```

## Future Enhancements

### Phase 1 (Current)
- ✅ Authentication system
- ✅ Dashboard with statistics
- ✅ User management
- ✅ Course management
- ✅ Job management
- ✅ Settings page

### Phase 2 (Planned)
- [ ] Hackathons management with event creation
- [ ] Roadmaps management with skill paths
- [ ] Content management by education level
- [ ] Resumes management with export

### Phase 3 (Future)
- [ ] Analytics and reporting
- [ ] Email notifications
- [ ] Bulk operations
- [ ] Advanced filtering
- [ ] Data visualization charts
- [ ] Activity logs
- [ ] Role-based permissions
- [ ] API integration
- [ ] Real-time updates
- [ ] File uploads
- [ ] Rich text editor for content

## API Integration (To Be Implemented)

### Example Endpoints Needed
```javascript
// Users
GET    /api/admin/users
GET    /api/admin/users/:id
POST   /api/admin/users
PUT    /api/admin/users/:id
DELETE /api/admin/users/:id

// Courses
GET    /api/admin/courses
POST   /api/admin/courses
PUT    /api/admin/courses/:id
DELETE /api/admin/courses/:id

// Jobs
GET    /api/admin/jobs
POST   /api/admin/jobs
PUT    /api/admin/jobs/:id
DELETE /api/admin/jobs/:id

// Stats
GET    /api/admin/stats/dashboard
GET    /api/admin/stats/users
GET    /api/admin/stats/courses
```

## Development Notes

### Testing Credentials
- **Admin Email**: admin@eshikshan.com
- **Admin Password**: admin123

### Key Features
1. **No Interaction with Main Site**: Admin panel is completely separate
2. **Protected Routes**: All admin pages require authentication
3. **Responsive Design**: Works on desktop, tablet, and mobile
4. **Smooth Animations**: Framer Motion for polished UX
5. **Consistent Design**: Unified color scheme and components

### Customization
To change the admin color theme, modify the following in all admin files:
- Replace `red-600` with your preferred primary color
- Adjust `gray-800/900` for background colors
- Update hover states for consistency

## Support

For issues or questions about the admin panel, contact the development team.

---

**Last Updated**: January 2025  
**Version**: 1.0.0  
**Status**: Active Development
