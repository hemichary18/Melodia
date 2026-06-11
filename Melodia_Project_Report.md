---
title: "Melodia: Detailed Project Report"
author: "Kandiboina Hemant Bhagavan"
---

# Melodia: Detailed Project Report

**Name:** Kandiboina Hemant Bhagavan  
**Enrollment No.:** 24CS003188  
**College:** Sir Padampat Singhania University  

---

## 1. Introduction to Melodia

Melodia is a next-generation music streaming web application designed to break the mold of traditional music players by prioritizing aesthetics, community, and contextual listening. Built with a stunning, glassmorphism-inspired dark mode UI, Melodia doesn't just play music—it creates an atmosphere.

The core philosophy of Melodia is that music is contextual. Whether a user is studying, driving, throwing a party, or trying to sleep, the application adapts its interface and functionality to match the vibe. By combining core streaming features with deeply integrated social networking and specialized listening "Modes," Melodia serves as a comprehensive hub for audio entertainment.

---

## 2. Feature Breakdown & How to Use

### Core Audio Engine & Advanced Playlists
* **The Queue System:** Unlike standard players that just handle a single track, Melodia features a robust, state-based queue engine. It loads surrounding tracks into memory, allowing seamless skipping forward (⏭) and backward (⏮).
* **Advanced Playlists:** Users can easily organize their libraries. The "Create Playlist" feature includes a multi-select modal, allowing users to select dozens of tracks instantly from their library to build a playlist in seconds. Hovering over a playlist reveals a sleek deletion control.

### The "Modes" Framework
Melodia features four distinct UI overlays designed for specific real-world contexts:

1. **Driving Mode:** A massive, distraction-free interface with giant playback controls that are easy to tap without looking. It dynamically pulls the currently playing track from the global queue.
2. **Focus Mode:** A built-in Pomodoro timer (Deep Focus, Short Break, Long Break) set against a soothing lo-fi background. It includes an independent, built-in Lo-Fi audio engine to play ambient beats without interrupting the main queue.
3. **Party Mode:** A collaborative listening room. It connects directly to the user's database, allowing them to search for real songs and add them to a global party queue. It features "Host Controls" to manage playback.
4. **Sleep Mode:** A built-in ambient noise generator with options for Rain Drops, Soft Wind, and Ocean Waves. It features a sleep timer that will automatically pause audio playback when the timer hits zero.

### Social Feed & Communities
* **Communities:** Users can create specific interest groups based on genres or vibes. Creating a community allows users to upload a cover image via Cloudinary integration, automatically generating a unique hub for like-minded listeners.
* **Rich Social Feed:** A Twitter-style feed where users can share their thoughts. The feed supports uploading images and searching the database to embed playable "Song Cards" directly into posts.

---

## 3. Technology Stack

Melodia is built using a modern, full-stack JavaScript architecture designed for scalability and performance.

### Frontend
* **React.js:** The core UI library, utilizing hooks and functional components.
* **TypeScript:** Ensures type safety and robust code architecture across the app.
* **Zustand:** A lightweight, fast state management solution. Used extensively for the `usePlayerStore` (managing the audio queue) and `useAuthStore`.
* **Tailwind CSS:** Utility-first CSS framework used to build the complex, responsive, glassmorphic UI.
* **Framer Motion:** Used for the micro-animations, layout transitions, and the dynamic pulsing effects in the various modes.
* **Vite:** The build tool, providing lightning-fast HMR (Hot Module Replacement) during development.

### Backend
* **Node.js & Express:** The core backend server framework.
* **MongoDB & Mongoose:** NoSQL database and ODM for storing Users, Songs, Playlists, Communities, and Social Posts.
* **Cloudinary:** Cloud storage solution used for handling image uploads (profile pictures, community covers, social feed attachments).
* **Socket.io:** Used in Party Mode to handle real-time, bi-directional communication between clients for the collaborative queue.

### AI Tools used in Melodia
* **ChatGPT and Claude:** Generating the prompt
* **Antigravity IDE:** For Building

---

## 4. Future Planning (Phase 4)

While the current application is highly feature-rich, Phase 4 of Melodia's development will introduce two major, complex features:

### Live Karaoke Engine
* We will implement a real-time lyric syncing engine.
* Using `.lrc` files uploaded to the database alongside `.mp3` files, the player will parse timestamped lyrics.
* The UI will be updated to include a "Karaoke View" that highlights the current line being sung, scrolling smoothly in sync with the `currentTime` of the HTML5 Audio element.

### Driving Mode Maps Integration
* The current Driving Mode is designed for audio control. Phase 4 will introduce actual navigation.
* We plan to integrate the Google Maps JavaScript API.
* The Driving Mode UI will be split, featuring the massive playback controls on the bottom half, and a live, interactive, dark-themed navigation map on the top half.

### Additional Roadmap
* Adding Trending Songs.
* Voting for songs in communities.
* Suggesting songs depending on the mood.
* Introducing new genres like Devotional, Retro, etc.

---

## 5. Development Prompts & AI Workflow

This project was built iteratively using the Antigravity AI coding assistant. The following prompt chain demonstrates the evolution of the application:

> **Core System Prompt:** Act as a Principal Software Architect, Senior Product Designer, Staff Frontend Engineer, Staff Backend Engineer, DevOps Engineer, Database Architect, and AI Engineer. Your task is to design and build a COMPLETE PRODUCTION-GRADE SaaS application called MELODIA.

### Project Vision & Tech Stack
Melodia was designed as a modern cloud music streaming platform inspired by Spotify, Apple Music, and SoundCloud, featuring a premium glassmorphic UI. The stack leverages React 19, Vite, TypeScript, TailwindCSS, Node.js, Express, and MongoDB Atlas.

### UI/UX Requirements
* World-class design system (Glassmorphism, Dark/Light theme, Smooth animations).
* Inspiration drawn from Spotify, Linear, and Vercel.

### Core Modules Developed
* **Global Music Player:** Persistent playback, seamless state management.
* **Karaoke Mode:** Planned real-time lyrics synchronization and scoring.
* **Driving Mode:** Distraction-free, gesture-based UI.
* **Focus Mode:** Built-in Pomodoro timer with ambient Lo-Fi playback.
* **Sleep Mode:** White noise generators with sleep timers.
* **Party Mode:** Real-time collaborative queue using WebSockets.
* **Social Communities:** Genre-based hubs with a rich music feed.
* **AI DJ & Mood Engine:** Dynamic playlist generation based on listening context.
* **Creator Hub:** Upload capabilities and analytics for artists.

### Iterative Feedback Highlights
* *"solve this when i am clicking the cover it is coming to right side but stoped playing the song as you know i have uploaded the lrc file..."* (Addressed initial UI bugs and established the need for the Karaoke engine).
* *"remove the white slide bars up and down and the left right"* (Refined the UI layout and overflow properties).
* *"in the admin upload remove the genre section and the add the plus icon at the bottm so that i can upload more once at a time"* (Streamlined the admin data entry process).
* *"make it mobile responsive"* (Triggered a massive layout shift, implementing Tailwind md: and lg: breakpoints across the Admin Dashboard and Library).
* *"now when i create the playlist it should ask me to select the songs to add..."* (Initiated the implementation of the advanced queue system, community creation form, and rich social feed attachments).
* *"suppose the any song song is playing and click the driving mode it is directly enter to the driving with the present song..."* (The final polish phase, connecting the UI facades of the 4 Modes to actual state, audio logic, and real database endpoints, concluding with the generation of this report).

---
**Melodia** - Built for the future of contextual listening.
