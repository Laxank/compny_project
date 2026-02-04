# Chaintech Network — Account Manager (Submission)

Demo account manager web app created for Chaintech Network submission.

---

## Overview

A small client-side React app demonstrating basic account registration, login, and profile editing. All data is stored locally in the browser (localStorage) for learning and experimentation.

Key points:
- Purpose: learning / demo only (not production-ready)
- Local-only data storage, no server or remote DB
- Built with React (v18), React Router, and Parcel for local development

---

## Features

- Register new users (stored in localStorage)
- Login and protected account page
- Edit profile (name and email) with basic validations
- Small, clean UI intended for demo and learning

---

## Tech stack

- React 18
- React Router DOM 6
- Parcel (dev/build)
- Plain localStorage-based services in `src/services`

---

## Setup & run (recommended)

1. Use Node LTS (recommended):

   - Install nvm-windows (if needed): https://github.com/coreybutler/nvm-windows
   - Install and use Node 18 (example):

   ```powershell
   nvm install 18.18.0
   nvm use 18.18.0
   ```

2. Install dependencies:

```powershell
npm install
```

3. Start dev server:

```powershell
npm start
```

4. Build for production:

```powershell
npm run build
```

---


## Notes (Important)

> Note: This application is built for learning and experimentation. It is not production-ready and does not include full security, scalability, or deployment considerations.

- No server-side validation or protections (only client-side checks)
- Passwords are stored as plain text in localStorage for demo purposes — never do this in production

