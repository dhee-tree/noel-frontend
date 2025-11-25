# Noel - Frontend

The frontend application for the Noel, a modern Secret Santa platform. Built with Next.js, this application provides a responsive and interactive user interface for managing Secret Santa groups, wishlists, and gift exchanges.

## 🚀 Tech Stack

### Frontend
- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: 
  - [React Bootstrap](https://react-bootstrap.github.io/) for layout and components
  - CSS Modules for custom styling
  - [React Icons](https://react-icons.github.io/react-icons/) for iconography
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) (v5)
  - Google OAuth Provider
  - Credentials Provider (Email/Password)
  - JWT Session Strategy
- **State Management & Data Fetching**: 
  - [SWR](https://swr.vercel.app/) for data fetching and caching
  - React Context for global UI state (e.g., Inactivity Timer)
- **Forms**: [React Hook Form](https://react-hook-form.com/) with [Zod](https://zod.dev/) validation

### Backend (Integration)
- **API**: Django REST Framework (DRF)
- **Database**: PostgreSQL
- **Containerization**: Docker & Docker Compose

## ✨ Key Features

### 🔐 Authentication & Security
- **Secure Login**: Support for both Email/Password and Google Sign-In.
- **Session Management**: 
  - JWT-based sessions with automatic token refreshing.
  - Inactivity timer that prompts users to stay logged in or auto-logs them out after 1 hour of inactivity.
  - Redirects preserve query parameters and URL hashes (e.g., `#email-preferences`) to ensure users land exactly where they intended after logging in.

### 🎁 Group Management
- **Create & Join Groups**: Users can easily create new Secret Santa groups or join existing ones via code.
- **Auto-Join Links**: Shareable links (e.g., `?join=CODE`) allow users to automatically join a group upon clicking, even if they need to log in or register first.
- **Social Sharing**: Integrated sharing modal to easily send group invite links via WhatsApp, Facebook, and SnapChat.

### 👤 User Profile
- **Profile Management**: Users can update their personal details, shipping address, and password.
- **Email Preferences**: Granular control over email notifications (marketing, newsletter, product updates), managed via a dedicated section in the profile.

## 🛠️ Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/dhee-tree/noel-frontend.git
   cd noel-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory and configure the following variables:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000
   AUTH_SECRET=your_auth_secret
   AUTH_GOOGLE_ID=your_google_client_id
   AUTH_GOOGLE_SECRET=your_google_client_secret
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open the app**
   Navigate to [http://localhost:3000](http://localhost:3000) in your browser.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
