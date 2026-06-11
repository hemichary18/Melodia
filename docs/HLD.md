# High-Level Design (HLD) - Melodia

## 1. System Architecture Overview
Melodia follows a modern Client-Server architecture utilizing a MERN stack (MongoDB, Express.js, React.js, Node.js) enriched with real-time WebSocket communication and cloud-based asset management.

## 2. Technology Stack
- **Frontend:** React.js, Vite, TypeScript, Tailwind CSS, Framer Motion, Zustand (State Management).
- **Backend:** Node.js, Express.js, TypeScript.
- **Database:** MongoDB (Mongoose ORM).
- **Real-time Engine:** Socket.IO.
- **Storage:** Cloudinary (Audio and Image hosting).
- **Authentication:** JSON Web Tokens (JWT) stored in HTTP-only cookies, Google OAuth 2.0.

## 3. High-Level Architecture Diagram
*(Conceptual Text Representation)*

```text
[ Client Device (Browser/Mobile) ]
        |            |
     (HTTPS)     (WebSockets)
        |            |
[ Vercel (Frontend Hosting) ] ---> [ Render (Backend Node.js API) ]
                                            |         |
                                   (Mongoose)    (Cloudinary API)
                                            |         |
                                 [ MongoDB ]   [ Cloudinary CDN ]
```

## 4. Sub-system Descriptions

### 4.1 Client Application (Frontend)
A Single Page Application (SPA) responsible for rendering the UI, managing local player state via Zustand, and connecting to the backend via standard HTTP REST calls and persistent WebSocket connections. Includes an isolated `<GlobalAudio />` component injected at the root layer to persist audio playback across route changes.

### 4.2 API Gateway / Backend Server
An Express.js REST API that handles:
- User Authentication (Registration, Login, Token generation).
- Data Retrieval (Fetching songs, playlists, feeds).
- Admin Functions (Multer integration for uploading files to Cloudinary).

### 4.3 Real-time Server (Socket.IO)
Operates alongside the Express server. It handles:
- **Chat Rooms:** Broadcasting messages to specific community channels.
- **Party Mode Queue:** Synchronizing the collaborative playlist, emitting events when songs are added, and tracking user votes in real-time.

### 4.4 Data Layer
- **MongoDB Database:** Stores relational-style metadata (Users, Songs, Playlists, Communities, Posts) using Mongoose schemas.
- **Cloudinary:** Stores raw binary data (MP3s, JPEGs/PNGs) and serves them rapidly via its CDN.

## 5. Security & Authentication Flow
1. User authenticates via email/password or Google OAuth.
2. Server validates and issues a JWT.
3. JWT is sent back as a secure, `SameSite=None`, `Secure`, `HttpOnly` cookie.
4. Subsequent requests to protected API endpoints automatically include this cookie.
5. The `authMiddleware` validates the cookie before granting access to resources.
