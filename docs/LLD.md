# Low-Level Design (LLD) - Melodia

## 1. Component Architecture (Frontend)

The frontend is divided into atomic, reusable React components and feature-specific layouts.

- **Layouts:** `MainLayout` (Sidebars + Main Content Area + Player UI).
- **Core Components:** `GlobalAudio` (hidden audio element tied to Zustand store), `Player`, `Sidebar`, `ProfileMenu`.
- **Feature Modules:**
  - **Auth:** `Login`, `Register`
  - **Explore/Library:** `Home`, `Search`, `Library`, `PlaylistView`
  - **Modes:** `FocusMode`, `SleepMode`, `PartyMode`, `DrivingMode` (Rendered outside of `MainLayout` to allow full-screen takeover).
  - **Social:** `SocialFeed`, `Communities`, `MusicRoom`

### 1.1 State Management (Zustand)
- **`useAuthStore`:** Manages user authentication state (`user`, `isAuthenticated`), and login/logout functions.
- **`usePlayerStore`:** Manages global audio playback (`currentSong`, `queue`, `volume`, `isPlaying`, `progress`, `duration`, `audioElement`).
- **`useSocketStore`:** Manages the active Socket.IO connection instance and connection status.

## 2. Database Schema (MongoDB / Mongoose)

### 2.1 User
```javascript
{
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String },
  role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
  profilePicture: { type: String },
  likedSongs: [{ type: ObjectId, ref: 'Song' }]
}
```

### 2.2 Song
```javascript
{
  title: { type: String, required: true },
  artist: { name: String, id: ObjectId },
  audioUrl: { type: String, required: true },
  coverImage: { type: String },
  lyrics: { type: String },
  uploadedBy: { type: ObjectId, ref: 'User' }
}
```

### 2.3 Playlist
```javascript
{
  name: { type: String, required: true },
  description: { type: String },
  creator: { type: ObjectId, ref: 'User' },
  songs: [{ type: ObjectId, ref: 'Song' }],
  isPublic: { type: Boolean, default: false }
}
```

### 2.4 Community / Post
- **Community:** `name`, `description`, `members`, `genreTags`.
- **Post:** `author`, `content`, `attachedSong`, `likes`, `comments`, `createdAt`.

## 3. Real-Time Socket Events Map

### 3.1 Connection & Rooms
- `join_room(roomId, username)`: Adds the socket to a specific room.
- `leave_room(roomId, username)`: Removes the socket from the room.

### 3.2 Chat
- `send_message(roomId, messageData)`: Broadcasts a text message to all users in a specific community room.
- `receive_message(messageData)`: Client listener for incoming chat messages.

### 3.3 Collaborative Queue (Party Mode)
- `sync_queue(roomId, queueArray)`: Updates the centralized queue for Party Mode.
- `queue_updated(queueArray)`: Emitted to all clients in the room to re-render the queue.

## 4. API Endpoint Handlers (Express)

- **Controllers:** Keep business logic abstracted from routes. 
  - `authController.ts` (Login, Register, Logout)
  - `songController.ts` (Upload, Fetch All, Like Song)
  - `playlistController.ts` (Create, Add/Remove Songs)
- **Middleware:** 
  - `authMiddleware.ts`: Verifies JWT tokens via cookies.
  - `adminMiddleware.ts`: Verifies user role is 'ADMIN'.
  - `multerUpload.ts`: Handles multipart form data for file uploads before sending them to Cloudinary.
