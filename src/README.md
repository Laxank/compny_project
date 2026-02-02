# Account Manager (React)

A minimal React (v16.8+) single-page app demonstrating registration, login, and a protected account page with edit functionality. Data is stored in the browser's `localStorage` for demo purposes.

Features
- Register a user (name, email, password)
- Login with email + password
- Protected account page to view/edit name & email
- Simple client-side validation
- No backend required (localStorage used)

Requirements
- Node.js 14+ (or compatible)
- npm

Install and run
1. Install dependencies:
   npm install

2. Start the dev server:
   npm start

The app uses Parcel for bundling; it will open in your browser automatically.

Notes & next steps
- This is intentionally simple for demonstration. Passwords are stored in plaintext in localStorage—do NOT use this for production.
- To add a backend, I can provide an Express server, or switch to json-server for quick prototyping.
- Add stronger validation, password hashing, and sessions stored server-side for production security.