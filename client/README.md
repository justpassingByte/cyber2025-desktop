# Cybercafe Client Application

This is the client application for the cybercafe management system, built with Electron, React, and TailwindCSS.

## Features

- Login & authentication system (via IPC, communicates with server app via socket.io)
- **Hybrid Real-time Session Tracking**: Smooth, per-second countdown timer in the UI, periodically synchronized with the server for authoritative time, ensuring a seamless user experience without sacrificing accuracy.
- **Secure Session Validation**: On startup, the client validates its stored session with the server, preventing inconsistent states and ensuring the UI always reflects the true login status.
- Dashboard with time tracking and session info
- Account balance display and recharge (multi-method: card, bank, MoMo)
- Services menu: Food & Drinks ordering, Recharge, Chat, Tournaments, Rewards, Reserve PC
- Reserve gaming stations with real-time status (available, occupied, reserved, maintenance)
- Tournaments: registration, viewing, and history
- Rewards & achievements: daily check-in, XP, redeemable rewards, quests
- Dark/Light theme support
- Responsive, modern UI
- **Real-time notifications (e.g. top-up) via socket.io → main process → IPC → renderer**

## Planned Features

- Accessory rental (headphones, controllers, etc.)
- Licensed game rental (Steam, Origin, etc.)
- More payment methods (ZaloPay, VNPay, etc.)
- In-app notifications
- User profile & history
- Admin/Staff management panel

## Architecture Overview

- **Client app** (Electron):
  - **Renderer process** (React): UI, calls authentication and other services via IPC.
  - **Main process**: Handles IPC from renderer, manages socket.io client connection to the server app, and forwards real-time notifications.
- **Server app** (Node.js):
  - Runs a socket.io server, handles authentication, business logic, and database access.

### Login Flow

1. User enters credentials in the React UI (renderer process).
2. Renderer calls `authService.login()` which sends an IPC message (`auth:login`) to the main process.
3. Main process receives IPC, forwards the login request via socket.io to the server app.
4. Server app authenticates, returns the result via socket.io.
5. Main process receives the result and sends it back to the renderer via IPC.
6. Renderer updates UI based on login result.
7. **After successful login, the renderer sends an IPC message (`socket:register-user`) with the userId to the main process, which then emits a `customer:link` event to the server via socket.io. This step ensures the server can map the correct socket to the logged-in user for notifications.**

**Note:** The renderer process does NOT connect to the server via socket directly. All communication is routed through the Electron main process for security and architecture clarity.

### Real-time Notification Flow (e.g. Top-up)

1. **Server** emits a socket event (e.g. `topup:completed`) with a type-safe payload (`TopUpNotificationData`).
2. **Main process** (Electron) receives the event via socket.io, and forwards it to all renderer processes via IPC (`mainWindow.webContents.send('topup:completed', data)`).
3. **Renderer process** listens for the IPC event (`ipcRenderer.on('topup:completed', ...)`), updates its notification state, and displays a popup notification in the UI.
4. **Notification types and interfaces** are defined in a shared `types/noti.ts` file for type safety and maintainability.
5. **Note:** The main process must have registered the userId with the server (see Login Flow step 7) to ensure notifications are routed to the correct client.

### Real-time Session & Data Synchronization Flow

The client employs a robust, hybrid approach to manage the user's session time and data in real-time.

1.  **Optimistic UI Counter**:
    -   The `UserContext` (Zustand store) in the renderer process runs a client-side `setInterval`.
    -   This timer decrements the `time_remaining` value every second, providing a smooth and responsive countdown on the UI (e.g., in the `Dashboard`).
    -   UI components are optimized to only re-render the time display, not the entire page, ensuring high performance.

2.  **Authoritative Server Sync**:
    -   The Electron main process listens for a `session:update` socket event from the server, which is sent every 10 seconds.
    -   Upon receiving this event, the main process forwards the authoritative `time_remaining` and `balance` to the renderer via an IPC message (`session:data-updated`).
    -   The `UserContext` listens for this IPC message and resets its local timer with the new, accurate data from the server. This corrects any potential client-side drift.

3.  **Startup Session Validation**:
    -   When the app starts, if a user session exists in `sessionStorage`, the renderer's `UserContext` sends an IPC message (`auth:validate-stored-session`) to the main process.
    -   The main process sends a `auth:validate-session` socket event to the server.
    -   The server checks if the session is still active in its memory and responds.
    -   If the session is invalid, the main process is notified, and it instructs the renderer (via IPC `auth:force-logout`) to clear the user data, effectively logging the user out.

This architecture ensures a fluid user experience, maintains high performance, and guarantees data consistency and accuracy by always treating the server as the source of truth.

## Prerequisites

- Node.js (v16+)
- npm or yarn

## Installation

1. Clone the repository
2. Navigate to the client directory:
   ```
   cd cybercafe-desktop/client
   ```
3. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn
   ```

## Development

To run the app in development mode:

```
npm run electron:dev
```

This will start both the Webpack dev server for React and the Electron app.

## Building

To build the app for production:

```
npm run build
```

Then package it for your platform:

```
npm run package
```

The packaged application will be in the `release` folder.

## Project Structure

- `src/main` - Electron main process code (IPC, socket.io client, notification forwarding)
- `src/main/types` - Shared type definitions (e.g. notification types)
- `src/main/services` - Main process services (socket, auth, notification, ...)
- `src/renderer` - React application (renderer process)
  - `components` - Reusable UI components
  - `pages` - Application pages
  - `styles` - CSS files

## Tech Stack

- Electron - Desktop application framework
- React - UI library
- TailwindCSS - Utility-first CSS framework
- TypeScript - Type checking 