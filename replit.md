# Overview

This is a Text to HTML Publisher web application that allows users to paste text content, convert it to HTML, and automatically push it to a GitHub repository. The application provides a user-friendly interface for content creation with real-time preview, file management, and GitHub integration.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The frontend is built using React with TypeScript, utilizing modern development practices:

- **React Router**: Uses Wouter for client-side routing with a minimal setup
- **State Management**: React hooks (useState) for local component state, TanStack React Query for server state management
- **UI Framework**: Radix UI components with shadcn/ui styling system built on Tailwind CSS
- **Styling**: Tailwind CSS with a comprehensive design system including CSS variables for theming
- **Build Tool**: Vite for fast development and optimized production builds

## Backend Architecture

The backend follows a REST API pattern with Express.js:

- **Framework**: Express.js with TypeScript for type safety
- **API Structure**: RESTful endpoints under `/api` prefix for clear separation
- **Request Handling**: Standard Express middleware for JSON parsing and URL encoding
- **Error Handling**: Centralized error handling middleware for consistent error responses
- **Development**: Hot reload and development server integration with Vite

## Data Storage Solutions

The application uses a flexible storage abstraction:

- **Database ORM**: Drizzle ORM configured for PostgreSQL with type-safe queries
- **Schema Management**: Shared schema definitions between frontend and backend using Drizzle and Zod
- **Storage Interface**: Abstract storage interface (IStorage) with in-memory implementation for development
- **Data Models**: Files and GitHub configurations with proper relationships and constraints

## Authentication and Authorization

- **GitHub Integration**: Uses GitHub personal access tokens for repository access
- **Token Management**: Environment variable based token configuration
- **Permissions**: Repository-level permissions through GitHub's access control

## External Dependencies

### Third-party Services
- **GitHub API**: Repository file management and commit operations via Octokit REST client
- **Neon Database**: Serverless PostgreSQL database hosting

### Key Libraries
- **Frontend**: React, TanStack React Query, Wouter, Radix UI, Tailwind CSS, date-fns
- **Backend**: Express.js, Drizzle ORM, Zod validation
- **Development**: Vite, TypeScript, ESBuild for production builds
- **Utilities**: Clsx for conditional classes, class-variance-authority for component variants

### Build and Development Tools
- **Package Manager**: npm with lock file for dependency consistency
- **TypeScript**: Strict type checking with path mapping for clean imports
- **Development Server**: Vite dev server with HMR and error overlay
- **Production Build**: Vite for frontend bundling, ESBuild for backend compilation

## Core Features

### Text Processing
- Real-time text to HTML conversion with live preview
- Support for basic formatting (paragraphs, lists, links)
- Character and line counting for content analysis

### GitHub Integration
- Direct file pushing to GitHub repositories
- Branch selection and commit message customization
- File conflict handling with SHA-based updates
- Repository validation and connection testing

### File Management
- Recent files tracking and display
- File settings configuration (name, directory structure)
- Full file path preview and validation

### User Interface
- Responsive design with mobile-first approach
- Component-based architecture with reusable UI elements
- Real-time status updates and error handling
- Toast notifications for user feedback