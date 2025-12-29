# Fused Lens Studio - Photography Portfolio Website

A high-performance, minimalist photography studio website with premium Apple-style design, built using React, Framer Motion, and GSAP. Features a complete admin panel for content management.

![Fused Lens Studio](https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=1200&q=80)

## ✨ Features

### 🎬 Hero Section
- Full-screen image slider with Ken Burns zoom effect
- Letter-by-letter animated tagline reveal with glow
- Subtle parallax scrolling
- Decorative corner elements
- Auto-advancing with manual navigation

### 🖼️ Portfolio
- Responsive masonry grid layout
- Scroll-triggered staggered animations
- Interactive hover previews with 3D tilt effect
- Dynamic category filtering (Wedding, Portrait, Commercial, Events)
- Full-screen lightbox with swipe gestures on mobile

### 👤 About
- Side-by-side image and text layout
- Parallax scroll effect on image
- Animated statistics counters (750+ projects, 500+ clients, etc.)
- Interactive timeline with milestone animations

### 💼 Services
- Interactive flip cards with hover animation
- Animated service icons
- Auto-rotating testimonials carousel

### 📧 Contact
- Animated map with bouncing pin
- Floating label inputs with underline glow
- WhatsApp integration & click-to-call buttons
- Success/error animations
- Social media links with hover effects

### 🧭 Navigation
- Sticky navbar with dynamic color change
- Scroll progress bar
- Smooth anchor scrolling
- Mobile hamburger menu with circular reveal
- Cursor glow effect on interactive elements

### ✨ Visual Effects
- Floating particles in background
- Custom cursor glow that follows mouse
- Shimmer line animations
- Micro-interactions throughout

### 🔐 Admin Panel
- Protected login (default: admin / admin123)
- Studio info management
- Social links editor
- Hero slides configuration
- Photo gallery management
- Services editor

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install all dependencies (frontend + backend)
npm run setup

# Start development (frontend only)
npm run dev

# Start backend server (in separate terminal)
npm run dev:server

# Or start both together
npm run dev:all

# Build for production
npm run build
```

### Default Credentials
- **Admin Panel**: http://localhost:3000/admin.html
- **Username**: admin
- **Password**: admin123

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool & dev server
- **Framer Motion** - React animations
- **GSAP** - Advanced scroll animations

### Backend
- **Express.js** - API server
- **JWT** - Authentication
- **Multer** - File uploads
- **JSON files** - Data storage (easily replaceable with MongoDB)

## 📁 Project Structure

```
├── src/
│   ├── components/
│   │   ├── Navigation/     # Sticky nav with scroll progress
│   │   ├── Hero/           # Ken Burns slider
│   │   ├── Portfolio/      # Masonry grid & lightbox
│   │   ├── About/          # Parallax & timeline
│   │   ├── Services/       # Flip cards & testimonials
│   │   ├── Contact/        # Form & WhatsApp buttons
│   │   ├── Footer/         # Site footer
│   │   └── Effects/        # Particles, cursor, shimmer
│   ├── hooks/              # Custom React hooks
│   ├── data/               # Content & image data
│   ├── admin/              # Admin panel components
│   └── styles/             # Global styles
├── server/
│   ├── routes/             # API routes
│   ├── middleware/         # Auth middleware
│   ├── data/               # JSON data files
│   └── uploads/            # Uploaded images
└── public/                 # Static assets
```

## 🎨 Design System

### Colors
- **Primary**: Charcoal (#1a1a1a)
- **Accent**: Champagne Gold (#c9a962)
- **Background**: Off-white (#fafafa)
- **Cream**: (#f5f3f0)

### Typography
- **Display**: Cormorant Garamond
- **Body**: Outfit

### Animations
- Smooth easing: `cubic-bezier(0.16, 1, 0.3, 1)`
- Ken Burns: 8s duration
- Staggered reveals
- Parallax scrolling
- Cursor tracking

## 📱 Responsive Design

- Mobile-first approach
- Breakpoints: 480px, 768px, 1024px, 1200px
- Touch-friendly interactions
- Swipe gestures on mobile lightbox

## 🔌 API Endpoints

### Public
- `GET /api/content` - All content
- `GET /api/photos` - All photos
- `GET /api/photos/category/:id` - Photos by category

### Protected (requires JWT)
- `PUT /api/content/studio` - Update studio info
- `PUT /api/content/social` - Update social links
- `PUT /api/content/hero` - Update hero slides
- `POST /api/photos` - Add photo
- `DELETE /api/photos/:id` - Delete photo

## 📄 License

MIT License - feel free to use for personal or commercial projects.

---

**Fused Lens Studio** - *Timeless Memories*
