# Nexora Learn - Professional E-Learning Ecosystem

Nexora Learn is a state-of-the-art, full-stack e-learning platform designed for high-performance educational delivery. It features a robust architecture supporting student enrollment, instructor course management, and comprehensive administrative oversight, all secured with modern industry standards.

![Nexora Learn Banner](https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=1200)

## 🚀 Key Features

### 👨‍🎓 Student Experience
- **Interactive Exploration**: Dynamic course discovery with advanced filtering (Category, Level, Language, Price).
- **Curriculum Player**: Premium video player with progress tracking and sequential access enforcement.
- **Certified Tracks**: Automatic certificate generation upon course completion with secure QR-code verification.
- **Personal Dashboard**: Manage purchased courses, track individual progress, and receive real-time notifications.
- **Enrollment Flow**: Streamlined enrollment capturing critical academic details for professional certification.

### 👨‍🏫 Instructor Suite
- **Dynamic Course Builder**: Intuitive multi-step course creation (Landing Page, Curriculum, Syllabus, Settings).
- **Media Management**: Secure video and brochure uploads integrated with Cloudinary.
- **Analytics Dashboard**: Real-time revenue tracking, student enrollment stats, and course performance metrics.
- **Communication Hub**: Direct messaging system for student-instructor interaction.

### 🛡️ Admin & Security
- **Global Control Panel**: Manage all users, monitor platform-wide payments, and approve/revoke certificates.
- **Rate Limiting**: Intelligent request throttling using Redis for DDoS and brute-force protection.
- **CSRF & XSS Protection**: Hardened security middleware using Helmet, MongoSanitize, and custom CSRF tokens.
- **Stateless Auth**: Secure JWT-based authentication using Passport.js.
- **Maintenance Mode**: One-click platform maintenance toggle with API-level graceful handling.

## 🛠️ Tech Stack

- **Frontend**: React.js, TailwindCSS (for custom components), Lucide Icons, ShadcnUI.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB with Optimized Pooling.
- **Caching & Rate Limiting**: Redis.
- **Asynchronous Tasks**: BullMQ with Redis (Email & Processing).
- **Media Hosting**: Cloudinary.
- **Payments**: Razorpay.
- **Real-time**: Socket.IO.
- **Formatting**: PDFKit (for Certificate generation).

## 📁 Project Structure

```text
E-learn/
├── client/              # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable UI elements
│   │   ├── context/     # State management (Auth, Student, Instructor)
│   │   ├── pages/       # Page components (Course Details, Dashboard, etc.)
│   │   └── services/    # API abstraction layer
├── server/              # Backend Express API
│   ├── controllers/     # Business logic
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API endpoint definitions
│   ├── middleware/      # Security, limiters, and loaders
│   ├── workers/         # Background processing (BullMQ)
│   └── helpers/         # Utility functions
```

## ⚙️ Environment Configuration

Create a `.env` file in the `server/` directory with the following variables:

```env
# Database & Server
MONGO_URI=your_mongodb_connection_string
PORT=5000
NODE_ENV=production|development

# Security
JWT_SECRET=your_high_entropy_secret
CORS_ORIGINS=http://localhost:5173,https://yourdomain.com

# Optional: Socket.IO (defaults to http://localhost:5173)
CLIENT_URL=https://your-client.onrender.com

# Media (Cloudinary)
CLOUDINARY_CLOUD_NAME=name
CLOUDINARY_API_KEY=key
CLOUDINARY_API_SECRET=secret

# Payment (Razorpay)
RAZORPAY_KEY_ID=key
RAZORPAY_KEY_SECRET=secret

# Redis (Rate Limiting & Workers)
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=password
```

### Deploying on Render (CORS)

Browsers block cross-origin requests unless the API sends `Access-Control-Allow-Origin`. This server allows:

- Every origin listed in `CORS_ORIGINS` (comma-separated).
- `https://nexoralearn.com` and `https://www.nexoralearn.com`.
- Any **HTTPS** frontend hosted on `*.onrender.com` (for example `https://client-bbyk.onrender.com`).

Set `CORS_ORIGINS` on Render to your exact client URL if you prefer an explicit allowlist, and set `CLIENT_URL` to the same URL for Socket.IO.

**Verify the correct service is deployed:** a GET to `/health` from this LMS API returns JSON with `timestamp` and `environment`. If you see a different payload (for example another `service` name), that Render URL is pointing at a different repository or start command—fix the Render service root/start script so this `server/` app is what runs, then redeploy.

## 🏃 Running Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Mohsahal/E-learn-platform.git
   cd E-learn-platform
   ```

2. **Setup Server**:
   ```bash
   cd server
   npm install
   npm run dev
   ```

3. **Setup Client**:
   ```bash
   cd ../client
   npm install
   npm run dev
   ```

---
*Built with ❤️ by the Nexora Learn Team.*
