# Linear Clone - Full Stack Project Management Application

A high-fidelity, pixel-perfect clone of Linear.app built with Next.js, React, Node.js, Express, MongoDB, and Socket.io. This project demonstrates comprehensive full-stack development with real-time synchronization, advanced filtering, and a polished user interface.

## 🎯 Features

### Core Functionality

#### ✅ Issue Tracking
- **Create, Edit, and Delete Issues** with comprehensive properties:
  - Title, Description (Markdown support ready)
  - Priority levels (Urgent, High, Medium, Low)
  - Status workflow (Todo → In Progress → In Dev Review → Done)
  - Assignee assignment
  - Due dates
  - Project association
  - Labels/Collections
  - Cycle/Sprint association
- **Inline Editing** - Click any field to edit directly
- **Drag-and-Drop** - Kanban board with smooth drag-drop functionality
- **Keyboard Shortcuts** - Power-user keyboard navigation

#### ✅ Multiple Views
- **Kanban Board View** - Visual column-based workflow
- **List View** - Table format with sortable columns
- Seamless view switching

#### ✅ Advanced Filtering & Search
- Filter by:
  - Status
  - Assignee
  - Priority
  - Project
  - Labels
- **Global Search** - Search across all issues by title, description, or issue ID
- **Command Palette (⌘K / Ctrl+K)** - Quick navigation and action execution
  - Search issues, projects, users
  - Quick filters (assignee:, status:, label:)
  - Create new issues

#### ✅ Projects
- Create and manage projects
- Associate multiple issues with projects
- Automatic progress calculation based on completed issues
- Project-level filtering

#### ✅ Cycles/Sprints
- Create time-boxed iterations
- Automatically include active issues
- Cycle progress tracking
- Start and end date management

#### ✅ Comments & Collaboration
- **Threaded Comments** on issues
- **Reactions** on comments (emoji reactions)
- **Mentions** support (user tagging)
- Real-time comment updates

#### ✅ Activity Feed
- Track all issue updates:
  - Issue creation
  - Status changes
  - Assignee changes
  - Comments added
  - Mentions

#### ✅ Teams & Workspace Management
- Multiple teams within workspace
- Team creation, renaming, archiving
- Team-based issue organization
- Team switching UI
- Team management page

#### ✅ File Attachments
- Upload files/images in issues and comments
- Image preview functionality
- File list display
- Remove attachments

#### ✅ Labels Management
- Create and manage labels
- Color-coded labels
- Label filtering
- Delete labels

#### ✅ Settings & Preferences
- Theme selection (Light/Dark)
- Notification preferences
- Email notification settings
- Keyboard shortcuts reference

#### ✅ Dedicated Views
- **Projects Page** - Full project management interface
- **Cycles Page** - Sprint/cycle management
- **Activity Feed** - Timeline of all updates
- **Settings Page** - User preferences

#### ✅ Real-time Synchronization
- WebSocket-based real-time updates
- Multiple client synchronization
- Live issue status changes
- Real-time comment updates

#### ✅ UI/UX Excellence
- **Pixel-perfect design** matching Linear's aesthetics
- **Smooth animations** and transitions
- **Dark theme** optimized interface
- **Responsive layout**
- **Drag-drop interactions** with visual feedback
- **Modal animations** with smooth opening/closing

## 🏗️ Architecture

### Tech Stack

**Frontend:**
- Next.js 13 (React framework)
- TypeScript
- React Beautiful DnD (drag-and-drop)
- Socket.io Client (real-time)
- Axios (HTTP client)

**Backend:**
- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- Socket.io (WebSocket server)
- RESTful API architecture

### Project Structure

```
linearapp/
├── linear-client/          # Next.js frontend application
│   ├── components/        # React components
│   │   ├── CommandPalette.tsx
│   │   ├── IssueDetailModal.tsx
│   │   └── icons/         # Icon components
│   ├── lib/              # Utilities and services
│   │   ├── api.ts        # API client functions
│   │   └── context.tsx   # React context for app state
│   ├── pages/            # Next.js pages
│   │   ├── index.tsx     # Main application page
│   │   └── _app.tsx      # App wrapper
│   └── styles/          # Global styles
│       └── globals.css   # Comprehensive styling
│
└── linear-server/        # Express backend application
    ├── src/
    │   ├── controller/   # API route controllers
    │   │   ├── ticket.controller.ts
    │   │   ├── user.controller.ts
    │   │   ├── team.controller.ts
    │   │   ├── project.controller.ts
    │   │   ├── label.controller.ts
    │   │   ├── cycle.controller.ts
    │   │   ├── comment.controller.ts
    │   │   ├── activity.controller.ts
    │   │   └── webhook.controller.ts
    │   ├── model/        # Mongoose data models
    │   │   ├── ticket.model.ts
    │   │   ├── user.model.ts
    │   │   ├── team.model.ts
    │   │   ├── project.model.ts
    │   │   ├── label.model.ts
    │   │   ├── cycle.model.ts
    │   │   ├── comment.model.ts
    │   │   └── activity.model.ts
    │   ├── config/       # Configuration files
    │   │   └── db.ts     # MongoDB connection
    │   └── app.ts        # Express app setup
```

## 🚀 Setup & Installation

### Prerequisites
- Node.js 18+ 
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Quick Start

1. **Clone the repository:**
```bash
git clone <repository-url>
cd linearapp
```

2. **Install dependencies:**
```bash
# Backend
cd linear-server
npm install

# Frontend
cd ../linear-client
npm install
```

3. **Set up environment variables:**

**Backend** - Create `linear-server/.env`:
```env
PORT=3001
MONGODB_URL=mongodb://localhost:27017/linear
BASE_URL=http://localhost:3001
CLIENT_URL=http://localhost:3000
```

**For MongoDB Atlas**, use:
```env
PORT=3001
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/linear?retryWrites=true&w=majority
BASE_URL=http://localhost:3001
CLIENT_URL=http://localhost:3000
```

**Frontend** - Create `linear-client/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_SERVER_URL=http://localhost:3001
```

4. **Run the application:**

**Option 1: Run separately (Recommended)**
```bash
# Terminal 1 - Backend
cd linear-server
npm run dev

# Terminal 2 - Frontend
cd linear-client
npm run dev
```

**Option 2: Use start script**
```bash
./start.sh
```

5. **Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

### MongoDB Setup

**Local MongoDB:**
1. Install MongoDB locally: https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. Use connection string: `mongodb://localhost:27017/linear`

**MongoDB Atlas (Cloud):**
1. Create a free account: https://www.mongodb.com/cloud/atlas
2. Create a cluster
3. Create a database user
4. Whitelist your IP address
5. Get connection string from Atlas dashboard
6. Update `MONGODB_URL` in `linear-server/.env`

## 📖 Usage Guide

### Creating Issues

1. Click "New Issue" button in the sidebar
2. Enter issue title and description
3. Set status, priority, assignee, project, and due date
4. Click "Create issue"

**Keyboard Shortcut:** Press `⌘K` (Mac) or `Ctrl+K` (Windows/Linux) and type "Create new issue"

### Managing Issues

- **Edit Issue:** Click on any issue card to open the detail modal
- **Change Status:** Drag and drop issues between columns or use the dropdown in issue details
- **Filter Issues:** Use the filter dropdowns in the top navigation
- **Search:** Use the search input or Command Palette (`⌘K`)

### Kanban vs List View

- Toggle between Kanban and List views using the view toggle buttons
- Kanban: Visual workflow with drag-and-drop
- List: Table view with sortable columns

### Command Palette

Press `⌘K` or `Ctrl+K` to open the command palette:
- Search for issues by typing
- Filter by typing `assignee:`, `status:`, `label:`
- Create new issues quickly
- Navigate to projects and users

### Projects

- Associate issues with projects in the issue detail modal
- View project progress automatically calculated
- Filter issues by project

### Cycles/Sprints

- Create cycles with start and end dates
- Associate issues with cycles
- Track cycle progress based on completed issues

## 🔧 API Endpoints

### Tickets
- `GET /ticket` - Get all tickets (with query params for filtering)
- `GET /ticket/:id` - Get ticket by ID
- `POST /ticket` - Create new ticket
- `PATCH /ticket/:id` - Update ticket
- `DELETE /ticket/:id` - Delete ticket

### Users
- `GET /user` - Get all users
- `GET /user/:id` - Get user by ID
- `POST /user` - Create user
- `PATCH /user/:id` - Update user

### Teams
- `GET /team` - Get all teams
- `GET /team/:id` - Get team by ID
- `POST /team` - Create team
- `PATCH /team/:id` - Update team
- `DELETE /team/:id` - Archive team

### Projects
- `GET /project` - Get all projects
- `GET /project/:id` - Get project by ID
- `POST /project` - Create project
- `PATCH /project/:id` - Update project
- `DELETE /project/:id` - Delete project

### Labels
- `GET /label` - Get all labels
- `POST /label` - Create label
- `PATCH /label/:id` - Update label
- `DELETE /label/:id` - Delete label

### Cycles
- `GET /cycle` - Get all cycles
- `GET /cycle/:id` - Get cycle by ID
- `POST /cycle` - Create cycle
- `PATCH /cycle/:id` - Update cycle
- `DELETE /cycle/:id` - Archive cycle

### Comments
- `GET /comment` - Get comments (filter by issue)
- `GET /comment/:id` - Get comment by ID
- `POST /comment` - Create comment
- `PATCH /comment/:id` - Update comment
- `PATCH /comment/:id/reaction` - Add/remove reaction
- `DELETE /comment/:id` - Delete comment

### Activity
- `GET /activity` - Get activity feed
- `POST /activity` - Create activity entry

## 🎨 Design System

The application uses a carefully crafted design system matching Linear's aesthetics:

- **Colors:**
  - Background: `#191a23`
  - Card: `#1e1f2e`
  - Border: `rgb(44, 45, 60)`
  - Primary: `rgb(87, 91, 199)`
  - Text: `rgb(238, 239, 252)`
  - Secondary Text: `#858699`

- **Typography:**
  - Font sizes: 11px (captions), 12px (small), 13px (body), 14px (large), 24px (headings)
  - Font weight: 400 (regular), 500 (medium), 600 (semibold)

- **Spacing:**
  - Consistent 4px, 8px, 12px, 16px, 24px spacing scale

## 🚀 Performance Optimizations

1. **Real-time Updates:** Efficient WebSocket event handling
2. **Client-side Filtering:** Fast in-memory filtering before API calls
3. **Lazy Loading:** Components load on demand
4. **Optimistic Updates:** UI updates immediately, syncs with server
5. **Debounced Search:** Prevents excessive API calls
6. **Memoized Components:** React.memo for expensive components

## 🎯 Future Enhancements

### Planned Features
- [ ] **Markdown Rendering** - Full markdown support in descriptions and comments
- [ ] **File Attachments** - Upload and preview images/files
- [ ] **Mobile Responsive View** - Optimized mobile experience
- [ ] **GitHub Integration** - Auto-link commits and PRs (webhook endpoints ready)
- [ ] **User Authentication** - JWT-based auth system
- [ ] **Workspace Settings** - Theme customization, notifications
- [ ] **Roadmap View** - Visual project timeline
- [ ] **AI-based Issue Triage** - Smart issue categorization
- [ ] **Export/Import** - CSV/JSON export functionality
- [ ] **Keyboard Shortcuts Modal** - Display all shortcuts

### Technical Improvements
- [ ] Unit and integration tests
- [ ] E2E testing with Playwright
- [ ] Performance monitoring
- [ ] Error boundaries
- [ ] Service worker for offline support
- [ ] Progressive Web App (PWA)

## 🤝 Contributing

This is a hackathon submission project. For contributions:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

This project is created for educational purposes and hackathon submission.

## 👥 Authors

Built as a hackathon project demonstrating full-stack development capabilities.

## 🙏 Acknowledgments

- Inspired by [Linear.app](https://linear.app)
- Built with modern web technologies and best practices
- Focus on pixel-perfect UI and smooth UX

---

**Built with ❤️ for Hackathon Submission**

