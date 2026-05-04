# Wheel of Fortune PSA - Virtual Gambling Awareness

This project is an Electron-based desktop application designed as an interactive Public Service Announcement (PSA) to raise awareness about the manipulative mechanics of virtual gambling platforms. 

The application presents itself as a flashy, Las Vegas-style "Wheel of Fortune" game. However, the simulation is intentionally rigged to demonstrate how virtual gambling platforms utilize psychological hooks, dopamine-driven user interfaces, and the illusion of winning to manipulate users. Regardless of the player's choices or perceived luck, the underlying state machine guarantees an eventual "bankruptcy" outcome, delivering a powerful educational message about the realities of gambling addiction.

## Features

*   **Rigged Simulation Engine**: An underlying state machine that controls win/loss probabilities to ensure a predetermined educational outcome (bankruptcy).
*   **Manipulative UI/UX**: Implements bright neon visuals, fast-paced animations, and deceptive "near-miss" feedback loops designed to mimic real-world gambling applications.
*   **Electron Desktop Architecture**: Packaged as a standalone executable for Windows and macOS to serve as an accessible, easily distributable educational tool.
*   **Educational Messaging**: Concludes with a high-impact public service announcement upon the inevitable exhaustion of the user's virtual funds.

## Installation and Usage

To run this project locally, ensure you have Node.js installed.

1. Clone the repository.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the application:
   ```bash
   npm start
   ```

## Build

To package the application into a distributable executable:

```bash
npm run dist
```

## Purpose

This software is developed strictly for educational and awareness purposes. It is designed to expose the deceptive algorithms and psychological tactics employed by predatory gambling systems, fostering a better understanding of digital addiction mechanics.
