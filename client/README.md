# Cybercafe Client Application

This is the client application for the cybercafe management system, built with Electron, React, and TailwindCSS.

## Features

- Login & authentication system
- Dashboard with time tracking and session info
- Account balance display and recharge (multi-method: card, bank, MoMo)
- Services menu: Food & Drinks ordering, Recharge, Chat, Tournaments, Rewards, Reserve PC
- Reserve gaming stations with real-time status (available, occupied, reserved, maintenance)
- Tournaments: registration, viewing, and history
- Rewards & achievements: daily check-in, XP, redeemable rewards, quests
- Dark/Light theme support
- Responsive, modern UI

## Planned Features

- Accessory rental (headphones, controllers, etc.)
- Licensed game rental (Steam, Origin, etc.)
- More payment methods (ZaloPay, VNPay, etc.)
- In-app notifications
- User profile & history
- Admin/Staff management panel

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

- `src/main` - Electron main process code
- `src/renderer` - React application (renderer process)
  - `components` - Reusable UI components
  - `pages` - Application pages
  - `styles` - CSS files

## Tech Stack

- Electron - Desktop application framework
- React - UI library
- TailwindCSS - Utility-first CSS framework
- TypeScript - Type checking 