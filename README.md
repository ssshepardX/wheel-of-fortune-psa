# Wheel of Fortune PSA - Virtual Gambling Awareness

![Electron](https://img.shields.io/badge/Electron-191970?style=for-the-badge&logo=Electron&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)

An interactive, Electron-based desktop application designed as a **Public Service Announcement (PSA)**. This project aims to raise awareness about the manipulative mechanics, psychological hooks, and deceptive algorithms used by virtual gambling platforms.

---

## 🎯 The Concept

The application presents itself as a flashy, Las Vegas-style "Wheel of Fortune" game. However, **the simulation is intentionally rigged**. 

It is engineered to demonstrate how gambling platforms utilize:
- Dopamine-driven user interfaces
- The illusion of control and "near-miss" feedback loops
- Dynamic probability manipulation

Regardless of the player's choices or perceived luck, the underlying state machine guarantees an eventual **bankruptcy** outcome. This forced outcome delivers a powerful, hands-on educational message about the realities of gambling addiction and why "the house always wins."

## ✨ Key Features

- **Rigged State Machine Engine**: A custom algorithm that controls win/loss probabilities in real-time to ensure the predetermined educational outcome.
- **Manipulative UI/UX Design**: Implements bright neon visuals, fast-paced animations, and deceptive audio-visual cues designed to mimic real-world predatory gambling applications.
- **Standalone Desktop App**: Packaged via Electron as a standalone executable for Windows and macOS, making it an accessible and easily distributable educational tool.
- **High-Impact Conclusion**: Concludes with a stark public service announcement upon the inevitable exhaustion of the user's virtual funds.

## 🛠️ Technologies Used

- **Frontend**: HTML5, CSS3 (Custom animations & styling), Vanilla JavaScript
- **Backend/Framework**: Electron.js
- **Build Tools**: Electron Builder, Electron Packager

## 🚀 Installation & Usage

To run this project locally on your machine, ensure you have [Node.js](https://nodejs.org/) installed.

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ssshepardX/wheel-of-fortune-psa.git
   cd wheel-of-fortune-psa
   ```

2. **Install the required dependencies:**
   ```bash
   npm install
   ```

3. **Start the application in development mode:**
   ```bash
   npm start
   ```

## 📦 Building for Production

To package the application into a distributable executable (.exe for Windows, .app/.dmg for macOS):

```bash
npm run dist
```
The compiled executables will be generated in the `dist` folder.

## ⚠️ Disclaimer & Purpose

This software is developed **strictly for educational and awareness purposes**. It is designed to expose the deceptive algorithms and psychological tactics employed by predatory gambling systems, fostering a better understanding of digital addiction mechanics. It does not involve real money and is not a real gambling application.
