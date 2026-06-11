# API Documentation - Melodia

## Base URL
Local Development: `http://localhost:5000/api`
Production: `https://melodia-api.onrender.com/api`

---

## 1. Authentication (`/api/auth`)

### `POST /api/auth/register`
Creates a new user account.
- **Body:** `{ "username": "JohnDoe", "email": "john@test.com", "password": "password123" }`
- **Response (201):** `{ "message": "User registered successfully", "user": { ... } }`

### `POST /api/auth/login`
Authenticates a user and sets an HTTP-only JWT cookie.
- **Body:** `{ "email": "john@test.com", "password": "password123" }`
- **Response (200):** `{ "message": "Logged in successfully", "user": { ... } }`

### `POST /api/auth/google`
Authenticates a user via Google OAuth Identity Services.
- **Body:** `{ "token": "eyJhbGciOiJ..." }`
- **Response (200):** Sets cookie and returns `{ "user": { ... } }`

### `POST /api/auth/logout`
Clears the JWT authentication cookie.
- **Response (200):** `{ "message": "Logged out successfully" }`

---

## 2. Songs (`/api/songs`)

### `GET /api/songs`
Retrieves a list of all available songs in the database.
- **Headers:** Requires Authentication Cookie.
- **Response (200):** `{ "songs": [ { "_id": "...", "title": "...", "audioUrl": "..." }, ... ] }`

### `POST /api/songs` (Admin Only)
Uploads a new song and its cover art to Cloudinary, then saves the metadata to MongoDB.
- **Headers:** Requires Admin Authentication Cookie.
- **Body:** `multipart/form-data` (Files: `audioFile`, `imageFile`, Fields: `title`, `artistName`, `lyrics`).
- **Response (201):** `{ "message": "Song uploaded successfully", "song": { ... } }`

---

## 3. Users (`/api/users`)

### `GET /api/users/profile`
Retrieves the profile data of the currently authenticated user.
- **Headers:** Requires Authentication Cookie.
- **Response (200):** `{ "_id": "...", "username": "...", "likedSongs": [...] }`

### `POST /api/users/like-song/:id`
Toggles a song's liked status for the authenticated user.
- **Headers:** Requires Authentication Cookie.
- **Response (200):** `{ "message": "Song liked/unliked" }`

---

## 4. Playlists (`/api/playlists`)

### `GET /api/playlists`
Retrieves all playlists created by the authenticated user.
- **Headers:** Requires Authentication Cookie.
- **Response (200):** `[ { "_id": "...", "name": "...", "songs": [...] } ]`

### `POST /api/playlists`
Creates a new empty playlist.
- **Body:** `{ "name": "My Workout Mix", "description": "High energy tracks" }`
- **Response (201):** `{ "message": "Playlist created", "playlist": { ... } }`

### `POST /api/playlists/:id/songs`
Adds a specific song to a specific playlist.
- **Body:** `{ "songId": "60b9c8d7..." }`
- **Response (200):** `{ "message": "Song added to playlist" }`

---

## 5. Social (`/api/posts` & `/api/communities`)

### `GET /api/posts`
Fetches the global social feed of user posts.
- **Response (200):** `[ { "content": "Listening to this on repeat!", "attachedSong": { ... }, "author": { ... } } ]`

### `POST /api/posts`
Creates a new social feed post.
- **Body:** `{ "content": "Check out this track", "songId": "..." }`
- **Response (201):** `{ "message": "Post created" }`
