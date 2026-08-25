# SmartSanchar (स्मार्ट सञ्चार)

> A modern, feature-rich Digital News, Media, and Advertisement Management Web Portal tailored for Nepali media publications.

---

## Overview

**SmartSanchar** (स्मार्ट सञ्चार) is a full-stack digital news platform designed to deliver breaking news, multimedia coverage, category-wise articles, and province-level reporting with local context. It features an interactive public news website, an integrated multimedia/video hub, and a powerful Admin Control Panel for editorial teams to publish articles, track analytics, and manage dynamic advertisement spaces.

---

## Key Features

### Public News & Media Portal
- **Multi-Category Content**: Dedicated feeds for **समाचार (News)**, **ताजा (Latest)**, **अपराध (Crime)**, **अर्थ (Economy)**, **समाज (Society)**, **सूचना प्रविधि (IT)**, and **भिडियो (Videos)**.
- **Province-Wise News Filter (प्रदेश समाचार)**: Categorized reporting for Nepal's 7 provinces (*Koshi, Madhesh, Bagmati, Gandaki, Lumbini, Karnali, Sudurpashchim*).
- **Featured & Breaking Stories**: High-impact hero sections to feature high-priority breaking news.
- **Nepali Date & Localization**: Integrated Nepali calendar converter (`nepali-date-converter`) for accurate local news timestamps and authentic typography.
- **Real-Time News Search**: Quick keyword search across article titles, summaries, and full body content.
- **Article Views Counter**: Tracks engagement by recording view counts on every article.
- **Responsive Article Modal & Details Page**: Interactive news reader with optimized media layout.

### Video & Multimedia Hub
- **Dedicated Video Hub**: Stream featured video reports with embedded YouTube playback.
- **Auto Video Extraction**: Instant video preview generation via YouTube URL/ID processing.

### Admin Control Panel & Management
- **Secure Authentication & Recovery**:
  - Direct admin login with password verification.
  - Password management and reset workflows.
- **News Article Publishing (CRUD)**:
  - Create, draft, publish, update, and delete news articles.
  - Set featured banners, assign category & province, and attach author credentials.
- **Ad Space Management (विज्ञापन व्यवस्थापन)**:
  - Manage dynamic banner ads across target positions: `header`, `sidebar`, and `content`.
  - Live campaign status control (`Active` / `Disabled`).
  - Metric tracking: Real-time **Impressions** and **Click-Throughs**.
- **Media & Image Cloud Storage**:
  - Image dropzone with Cloudinary drag-and-drop cloud upload integration.
- **Dashboard Analytics**:
  - Real-time overview of total published stories, draft queue, video feeds, total ads, and total reader views.

### Security & Performance
- Rate limiting (`express-rate-limit`) to prevent abuse and brute-force attacks.
- Security headers via `Helmet.js`.
- MongoDB injection prevention and XSS filtering.
- Compressed HTTP payloads (`compression`) and optimized image delivery through Cloudinary.

---

## Tech Stack

### **Frontend & Web Portal (`/web`)**
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **UI & Styling**: [React 19](https://react.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [Lucide React Icons](https://lucide.dev/)
- **State Management & Data Fetching**: Redux Toolkit, TanStack React Query v5, Axios
- **Localization**: `nepali-date-converter`, `date-fns`
- **Database Connection**: Mongoose ODM (Serverless/API Routes)

### **Backend Microservice (`/services`)**
- **Runtime**: [Node.js](https://nodejs.org/), [Express 5](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose 9](https://mongoosejs.com/)
- **Storage**: [Cloudinary](https://cloudinary.com/) API
- **Security**: Helmet, Cors, Express Rate Limit, Cookie Parser, bcryptjs, JSONWebTokens

---

## Repository Structure

```
SmartSanchar/
├── web/                      # Next.js 16 Web Application & Admin Panel
│   ├── src/
│   │   ├── app/              # App Router Routes (Public, Admin, API)
│   │   │   ├── (public)/     # Public pages (samachar, artha, province, etc.)
│   │   │   ├── admin/        # Admin portal (dashboard, news, ads, videos)
│   │   │   └── api/          # Serverless API routes (articles, ads, auth, upload)
│   │   ├── components/       # UI Components (Layout, Home, Common)
│   │   ├── models/           # Mongoose Data Schemas (Article, Ad, Admin)
│   │   ├── hooks/            # Custom React Hooks
│   │   └── lib/              # Utility functions & helpers
│   ├── public/               # Static assets
│   └── package.json
├── services/                 # Express.js Backend Microservice
│   ├── src/
│   │   ├── config/           # DB, Cloudinary, Env, Logger configurations
│   │   ├── middlewares/      # Security & Error handling middlewares
│   │   ├── app.js            # Express App configuration
│   │   └── server.js         # Entry point server
│   └── package.json
├── env file.txt              # Environment variables template reference
└── README.md                 # Project Documentation
```

---

## Environment Variables Setup

Create a `.env.local` file inside the `web/` directory (and `.env` inside `services/` if running the Node/Express backend separately):

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/smartsanchar

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key

# Cloudinary Integration (Image Uploads)
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

---

## Quick Start & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher recommended)
- [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas)
- Cloudinary Account (for media management)

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/SmartSanchar.git
cd SmartSanchar
```

### 2. Setup & Run Web Portal (`web`)
```bash
cd web
npm install
npm run dev
```
The web application and admin portal will be running at [http://localhost:3000](http://localhost:3000).

### 3. Setup & Run Backend Services (`services`) *(Optional / Microservices mode)*
```bash
cd ../services
npm install
npm run dev
```
The Express service will run on port `5000` (or configured port).

---

## Database Schemas

- **`Article`**: `title`, `slug`, `category`, `province`, `summary`, `content`, `imageUrl`, `videoId`, `author`, `views`, `status` (`Published`/`Draft`), `isFeatured`, timestamps.
- **`Ad`**: `title`, `imageUrl`, `linkUrl`, `position` (`header`/`sidebar`/`content`), `status` (`Active`/`Disabled`), `clicks`, `impressions`, timestamps.
- **`Admin`**: `name`, `email`, `password`, `role`, `otp`, `otpExpires`, timestamps.

---

## License

This project is proprietary client software built for Smart Sanchar Media. All rights reserved.
