# Healthcare Wellness Portal - Frontend

React-based frontend application for the Healthcare Wellness Portal.

## Features

### Patient Features
- **Dashboard**: Overview of wellness goals and upcoming appointments
- **Goal Tracker**: Log daily progress towards wellness goals
- **Book Appointments**: Schedule appointments with healthcare providers
- **Profile Management**: Update personal health information

### Doctor Features
- **Dashboard**: Overview of patients and availability
- **Patient Management**: View patient details and set wellness goals
- **Availability Management**: Configure available time slots for appointments

### Security
- JWT-based authentication
- Role-based access control (Patient/Doctor)
- Protected routes
- HIPAA-compliant data handling

## Tech Stack

- React 18
- React Router 6
- Axios for API calls
- CSS Modules for styling
- Context API for state management

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with your backend API URL
# REACT_APP_API_URL=http://localhost:5000/api
```

### Running the Application

```bash
# Start development server
npm start

# Build for production
npm run build

# Run tests
npm test
```

The application will run on `http://localhost:3000`

## Project Structure

```
src/
├── components/
│   ├── Auth/           # Login and Register components
│   ├── Patient/        # Patient dashboard and features
│   ├── Doctor/         # Doctor dashboard and features
│   ├── Public/         # Public pages (Home)
│   └── Shared/         # Shared components (Navigation, Layout, etc.)
├── context/
│   └── AuthContext.jsx # Authentication context
├── services/
│   └── api.js          # API service layer
├── App.jsx             # Main app component with routing
└── index.js            # Application entry point
```

## Available Routes

### Public Routes
- `/` - Home page
- `/login` - Login page
- `/register` - Registration page

### Patient Routes (Protected)
- `/patient/dashboard` - Patient dashboard
- `/patient/goals` - Wellness goals tracker
- `/patient/book-appointment` - Book appointment
- `/patient/profile` - Patient profile

### Doctor Routes (Protected)
- `/doctor/dashboard` - Doctor dashboard
- `/doctor/patients` - Patient management
- `/doctor/availability` - Availability management

## API Integration

The frontend communicates with the backend API using Axios. All API calls are configured in `src/services/api.js`.

API base URL is configured via environment variable:
```
REACT_APP_API_URL=http://localhost:5000/api
```

## Authentication Flow

1. User logs in via `/login` or registers via `/register`
2. JWT token is received and stored in localStorage
3. Token is automatically attached to all subsequent API requests
4. Protected routes check authentication and role before rendering
5. User is redirected to appropriate dashboard based on role

## Development Notes

- All forms include proper validation
- Error messages are displayed to users
- Loading states are implemented for async operations
- Responsive design for mobile and desktop
- HIPAA consent checkbox required for patient registration

## Environment Variables

- `REACT_APP_API_URL` - Backend API URL

## License

MIT
