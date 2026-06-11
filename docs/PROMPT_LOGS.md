# Prompt Logs - Melodia Project

*This document serves as a historical log of the iterative AI prompts utilized to conceptualize, scaffold, and refine the Melodia application.*

## Phase 1: Conceptualization & UI Scaffolding
**Prompt 1:**
> "Design a full-stack music streaming application called 'Melodia'. I want the UI to be a dark-mode, glassmorphism-inspired aesthetic with vibrant gradients (pink/purple). Use React, Vite, and Tailwind CSS for the frontend. Set up a Sidebar with navigation links for Home, Library, Communities, and 'Modes'."

**Prompt 2:**
> "Create the 'Player' component that sits at the bottom of the screen. It should include Play/Pause, Skip Back/Forward, a progress bar, and volume controls. Make sure the album art expands when clicked to show a full-screen view. Use Framer Motion for smooth transitions."

## Phase 2: Contextual Modes
**Prompt 3:**
> "I want Melodia to be context-aware. Build four specialized listening modes that take over the entire screen:
> 1. Driving Mode: Massive touch targets, ultra-simplified UI, high contrast.
> 2. Sleep Mode: Dark, starry background with ambient sound toggles (Rain, Wind, Waves) and an automated sleep timer.
> 3. Focus Mode: Pomodoro timer integration with a lo-fi visualizer.
> 4. Party Mode: A collaborative queue where multiple users can upvote/downvote tracks."

## Phase 3: Backend & Database Setup
**Prompt 4:**
> "Set up an Express.js backend with MongoDB. Create Mongoose schemas for User, Song, and Playlist. Implement JWT-based authentication using HTTP-only cookies. Add a route for Admins to upload mp3 files and cover art directly to Cloudinary using Multer."

**Prompt 5:**
> "The songs need to play globally without being interrupted when the user navigates between pages or enters full-screen modes. Extract the `<audio>` element from the Player UI and mount it at the root of the App using a global state manager like Zustand."

## Phase 4: Bug Fixes & Refinements
**Prompt 6:**
> "The Driving Mode layout breaks on mobile screens because the buttons are hardcoded to w-72. Update the Driving Mode to use Tailwind responsive classes (md:w-72, w-48 on small screens) so it scales beautifully."

**Prompt 7:**
> "When attempting to log in via Google OAuth on production (Vercel), I am getting a 'Cross-Origin-Opener-Policy would block window.postMessage' error. Please fix the Vercel headers so Google Sign-in works properly."
