# Linear Clone - Full Stack Project Management Application

> **Hackathon Assignment Submission** - Linear Reinforcement Learning Environment

A high-fidelity, pixel-perfect clone of Linear.app built with Next.js, React, Node.js, Express, MongoDB, and Socket.io. This project demonstrates comprehensive full-stack development with real-time synchronization, advanced filtering, and a polished user interface.

## 🔗 Live Demo

- **Frontend (Vercel)**: https://linearapp-ecru.vercel.app
- **Backend (Render)**: https://linearapp-1.onrender.com
- **GitHub Repository**: https://github.com/ruthwikchikoti/linearapp

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
PORT=3005
MONGODB_URL=mongodb://localhost:27017/linear
BASE_URL=http://localhost:3005
CLIENT_URL=http://localhost:3000
```

**For MongoDB Atlas**, use:
```env
PORT=3005
MONGODB_URL=mongodb+srv://username:password@cluster.mongodb.net/linear?retryWrites=true&w=majority
BASE_URL=http://localhost:3005
CLIENT_URL=http://localhost:3000
```

**Frontend** - Create `linear-client/.env.local`:
```env
NEXT_PUBLIC_API_URL=http://localhost:3005
NEXT_PUBLIC_SERVER_URL=http://localhost:3005
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
- Backend API: http://localhost:3005

### Docker Compose Setup (Recommended)

The easiest way to run the entire application stack is using Docker Compose. This will automatically set up MongoDB, backend, and frontend services.

**Prerequisites:**
- Docker Engine and Docker Compose

**Installation:**

**Linux (Ubuntu/Debian):**
```bash
# Option 1: Using the provided installation script (Recommended)
sudo bash install-docker.sh

# Option 2: Manual installation
# Update package index
sudo apt-get update

# Install prerequisites
sudo apt-get install -y ca-certificates curl gnupg lsb-release

# Add Docker's official GPG key
sudo mkdir -p /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg

# Set up Docker repository
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# Install Docker
sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Add your user to docker group (to run without sudo)
sudo usermod -aG docker $USER

# Log out and log back in, or run:
newgrp docker

# Verify installation
docker --version
docker compose version
```

**macOS/Windows:**
- Install Docker Desktop from https://www.docker.com/products/docker-desktop/
- Docker Compose is included with Docker Desktop

**Quick Start with Docker:**

1. **Clone the repository:**
```bash
git clone <repository-url>
cd linearapp
```

2. **Start all services with Docker Compose:**
```bash
docker-compose up --build
```

This command will:
- Build Docker images for frontend and backend
- Start MongoDB container
- Start backend server (port 3005)
- Start frontend server (port 3000)
- Set up all necessary networking and volumes

3. **Access the application:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:3005
- MongoDB: localhost:27017

**Docker Compose Commands:**

```bash
# Start services in detached mode (background)
docker-compose up -d

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f mongodb

# Stop all services
docker-compose down

# Stop and remove volumes (clears database)
docker-compose down -v

# Rebuild and restart services
docker-compose up --build

# Restart a specific service
docker-compose restart backend
```

**Docker Compose Services:**
- `backend` - Express API server with TypeScript (connects to MongoDB Atlas)
- `frontend` - Next.js React application
- `mongodb` - (Optional) Local MongoDB 7 database - uncomment in `docker-compose.yml` to use local MongoDB instead of Atlas

**Environment Variables:**
Docker Compose automatically configures:
- Backend connects to MongoDB Atlas (configured in `docker-compose.yml`)
- Frontend connects to backend at `http://localhost:3005`
- Uploads directory is persisted in `./linear-server/uploads`

**MongoDB Configuration:**
- **Default:** Uses MongoDB Atlas (configured in `docker-compose.yml`)
- **Local MongoDB:** To use a local MongoDB container instead, uncomment the `mongodb` service and volumes section in `docker-compose.yml`, and update `MONGODB_URL` to `mongodb://mongodb:27017/linear`

**Production Deployment:**
For production, update the environment variables in `docker-compose.yml`:
- Change `CLIENT_URL` to your production frontend URL
- Change `BASE_URL` to your production backend URL
- Update `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_SERVER_URL` in frontend build args

### MongoDB Setup (Manual Installation)

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

## 🏛️ Architecture & Design Decisions

### System Architecture

The application follows a **client-server architecture** with real-time synchronization:

```
┌─────────────┐         HTTP/REST         ┌─────────────┐
│   Next.js   │ ◄─────────────────────► │   Express   │
│  Frontend   │                           │   Backend   │
│             │                           │             │
│  React UI   │     WebSocket (Socket.io)  │  MongoDB   │
│             │ ◄─────────────────────► │  Database   │
└─────────────┘                           └─────────────┘
```

### Frontend Architecture

**Component Hierarchy:**
- `_app.tsx` - Root wrapper with global state (AppProvider)
- `AppLayout.tsx` - Persistent sidebar and navigation
- `pages/index.tsx` - Main issues page (Kanban/List views)
- `IssueDetailModal.tsx` - Full issue editing interface
- `CommandPalette.tsx` - Global command menu (⌘K)
- `ActivityFeed.tsx` - Activity timeline component

**State Management:**
- React Context API for global state (teams, current team, user, theme)
- Local component state for UI interactions
- Optimistic updates for better UX

**Real-time Integration:**
- Socket.io client connects on page load
- Joins team-specific rooms for scoped updates
- Listens for: `recieved-ticket`, `recieved-update-ticket`, `ticket-deleted`, `comment-created`, `comment-updated`, `activity-created`

### Backend Architecture

**API Structure:**
- RESTful API with Express routers
- Controllers handle business logic
- Models define MongoDB schemas
- WebSocket events for real-time updates

**Real-time Synchronization Strategy:**

1. **Connection Model:**
   - Each client connects to Socket.io server
   - Client joins team-specific room: `socket.join(teamId)`
   - Events broadcasted to specific team rooms

2. **Event Flow:**
   ```
   Client Action → API Request → Database Update → Socket Event → All Clients in Room
   ```

3. **Consistency Handling:**
   - Server is source of truth
   - All updates go through API endpoints
   - Socket events broadcast after successful DB update
   - Client receives event and updates local state
   - Conflicts handled by server timestamps

4. **Edge Cases Handled:**
   - **Concurrent Updates:** Last write wins (MongoDB updates are atomic)
   - **Network Failures:** Client retries failed API calls
   - **Socket Disconnection:** Client reconnects and re-syncs data
   - **Race Conditions:** Backend validates and applies updates sequentially
   - **Stale Data:** Periodic refresh + socket updates keep data fresh

**Data Models:**
- **Ticket:** Issues with status, priority, assignee, project, cycle, labels
- **Team:** Workspace teams with members and identifier
- **Project:** Grouping mechanism for issues
- **Cycle:** Time-boxed sprints with start/end dates
- **Comment:** Threaded comments with parent references
- **Activity:** Audit trail of all changes
- **User:** User profiles with preferences
- **Label:** Categorization system

### Business Logic

1. **Issue ID Generation:**
   - Format: `{TEAM_IDENTIFIER}-{SEQUENTIAL_NUMBER}`
   - Generated server-side on issue creation
   - Ensures uniqueness per team

2. **Progress Calculation:**
   - Projects: `(Completed Issues / Total Issues) * 100`
   - Cycles: `(Completed Issues / Total Issues) * 100`
   - Calculated dynamically on each request

3. **Auto-include Active Issues in Cycles:**
   - When cycle is created, automatically assigns active issues (TODO, INPROGRESS, IN_DEV_REVIEW)
   - Only includes issues without existing cycle assignment
   - Prevents duplicate assignments

4. **Activity Tracking:**
   - Created automatically on issue/comment operations
   - Tracks: issue_created, issue_updated, issue_assigned, status_changed, comment_added, mention
   - Used for activity feed and notifications

5. **Threaded Comments:**
   - Parent comments have `parent: null`
   - Replies reference parent via `parent: commentId`
   - UI organizes comments hierarchically

6. **Mentions:**
   - Detected via `@username` pattern in comments
   - Extracted and stored in `mentions` array
   - Used for activity feed filtering

## 🚀 Performance Optimizations

1. **Real-time Updates:** Efficient WebSocket event handling with room-based broadcasting
2. **Client-side Filtering:** Fast in-memory filtering before API calls
3. **Lazy Loading:** Components load on demand
4. **Optimistic Updates:** UI updates immediately, syncs with server asynchronously
5. **Debounced Search:** Prevents excessive API calls during typing
6. **Memoized Components:** React.memo for expensive components
7. **Database Indexing:** MongoDB indexes on frequently queried fields (team, status, assignee)
8. **Selective Population:** Only populate required relationships in API responses
9. **Batch Operations:** Use Promise.all for parallel data fetching
10. **Connection Pooling:** MongoDB connection reuse via Mongoose

### Edge Cases & Error Handling

**Handled Edge Cases:**
- ✅ Empty states (no issues, no comments, no projects)
- ✅ Network timeouts and retries
- ✅ Invalid team/issue IDs
- ✅ Concurrent issue updates
- ✅ Socket reconnection after disconnect
- ✅ Large datasets (pagination ready, currently shows all)
- ✅ File upload failures
- ✅ Invalid file types/sizes
- ✅ Missing required fields in API requests
- ✅ Duplicate team identifiers
- ✅ Orphaned comments (handled by parent reference)

## 📊 API Documentation

### Synchronization Strategy

**Real-time Updates Flow:**

1. **Client Action:** User performs action (create/update issue, add comment)
2. **API Request:** Client sends HTTP request to backend
3. **Database Update:** Backend validates and updates MongoDB
4. **Socket Broadcast:** Backend emits Socket.io event to team room
5. **Client Receives:** All connected clients in team receive update
6. **UI Update:** Clients update local state and re-render

**Socket Events:**
- `create-ticket` → `recieved-ticket` (broadcast to team room)
- `update-ticket` → `recieved-update-ticket` (broadcast to team room)
- `delete-ticket` → `ticket-deleted` (broadcast to team room)
- `create-comment` → `comment-created` (broadcast to team room)
- `update-comment` → `comment-updated` (broadcast to team room)
- `new-activity` → `activity-created` (broadcast to team room)

**Room Management:**
- Clients join team room: `socket.emit('current-team', teamId)`
- Server joins socket to room: `socket.join(teamId)`
- Events broadcasted: `socket.in(teamId).emit(event, data)`

## 🎯 Future Enhancements

As per assignment requirements, suggestions for future improvements:

### User Experience
- **Mobile Responsive View** - Fully optimized mobile and tablet experience with touch gestures
- **Offline Support** - Service worker implementation for offline functionality
- **Progressive Web App (PWA)** - Installable app with native-like experience
- **Advanced Keyboard Navigation** - More extensive keyboard shortcut system

### Features
- **User Authentication & Authorization** - JWT-based auth system with role-based access control
- **Roadmap View** - Visual project timeline with Gantt-chart style planning
- **AI-based Issue Triage** - Smart issue categorization and priority suggestions using ML
- **Advanced Integrations** - Slack, Jira, GitLab, Figma integrations beyond GitHub
- **Export/Import** - CSV/JSON export for data portability and backups
- **Email Notifications** - Configurable email alerts for mentions, assignments, and updates
- **Advanced Search** - Full-text search with filters and saved search queries

### Technical Improvements
- **Testing Suite** - Unit, integration, and E2E tests with Playwright/Jest
- **Performance Monitoring** - Real User Monitoring (RUM) with analytics
- **Error Boundaries** - Comprehensive error handling and recovery
- **Pagination & Virtual Scrolling** - Handle large datasets (1000+ issues)
- **Caching Layer** - Redis for frequent queries and session management
- **Rate Limiting** - API rate limiting to prevent abuse
- **Database Optimization** - Advanced indexing and query optimization
- **CI/CD Pipeline** - Automated testing and deployment workflows

---

**Hackathon Submission** - Linear Reinforcement Learning Environment Assignment

**Repository shared with:**
- https://github.com/Naman-Bhalla/
- https://github.com/raun/