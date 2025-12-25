# 🐍 Snake Stream Battle (SnakeLive)

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-ISC-green)
![Node](https://img.shields.io/badge/node-%3E%3D16-yellow)

**Snake Stream Battle** is an interactive, real-time web application designed for TikTok Live streaming. It modernizes the classic Snake game by allowing live chat participants to influence the gameplay through gifts and likes.

Built with **Node.js**, **Socket.io**, and **TikTok-Live-Connector**, this project features a "Team vs. Team" mechanic (e.g., Girls vs. Boys), automated AI gameplay for AFK streaming, and a retro "Nokia-style" aesthetic.

---

## 🚀 Features

* **TikTok Integration:** Connects directly to TikTok Live chat to listen for specific gifts and events.
* **Team Battle System:** Assigns teams (Team A vs. Team B) with customizable colors and names.
* **Dynamic Gift Triggers:**
    * **Standard Spawn:** Configurable gifts (e.g., Rose, TikTok) spawn food items on the map.
    * **Super Boosts:** High-value gifts trigger "Boost" items worth 10x points (500 pts).
* **Dual Game Modes:**
    * **Auto (AI):** A pathfinding algorithm plays the game automatically (great for engagement farming).
    * **Manual:** Play manually using keyboard arrows or the on-screen mobile D-Pad.
* **Visuals:** Retro CRT/Nokia aesthetic with responsive canvas resizing.
* **PWA Support:** Installable on mobile devices via `manifest.json` and Service Worker.

---

## 🛠 Tech Stack

* **Backend:** Node.js, Express, Socket.io, tiktok-live-connector.
* **Frontend:** HTML5 Canvas, Vanilla JavaScript, TailwindCSS (CDN).
* **Styling:** Custom CSS with pixel-art fonts ('Press Start 2P').

---

## 📦 Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/AdisonDevLabs/snake.git](https://github.com/AdisonDevLabs/snake.git)
    cd snake
    ```

2.  **Install Dependencies**
    ```bash
    pnpm install
    ```
    *Dependencies include: `express`, `socket.io`, `tiktok-live-connector`, and `nodemon` for dev.*

3.  **Start the Server**
    ```bash
    # Production start
    pnpm start

    # Development mode (auto-restart)
    pnpm dev
    ```

4.  **Access the App**
    Open your browser and navigate to `http://localhost:4000`.

---

## ⚙️ Configuration & Usage

The application launches with a **Stream Setup Dashboard** overlay.

### 1. Team Configuration
Configure the two competing sides in the dashboard:
* **Team Name:** Display name (e.g., "GIRLS", "BOYS").
* **Color:** The color of the snake food/particles for this team.
* **Trigger Gift:** Select which TikTok gift spawns normal food (e.g., Rose, Ice Cream).
* **Super Boost:** Select a high-tier gift for point boosts (e.g., Money Gun, Galaxy).

### 2. Connection Settings
* **Username:** Enter the `@username` of the TikTok account currently live.
* **Game Mode:** Select "AUTO PLAY" for AI bot or "MANUAL PLAY" for human control.

### 3. Go Live
Click **"GO LIVE"** to connect to the stream. The dashboard will hide, and the game canvas will appear.

---

## 🎮 Game Mechanics

| Event | Trigger | Effect | Points |
| :--- | :--- | :--- | :--- |
| **Team Gift** | Selected Gift (e.g., Rose) | Spawns food in Team Color | **+50** |
| **Boost Gift** | Selected Boost (e.g., Money Gun) | Spawns Glowing Orb | **+500** |
| **Collision** | Snake hits wall/tail | Game Over & Win Recorded | - |

* **Winning Condition:** When the snake crashes, the team with the higher score wins the round. The "Wins" counter increments automatically.
* **Fake Bot Simulation:** If no connection is available, the game runs a "Fake Bot" simulation for testing purposes.

---

## 📂 Project Structure

```text
├── public/
│   ├── images/          # Gift assets and icons
│   ├── script.js        # Main game loop, AI logic, and UI handling
│   ├── style.css        # Retro styling and animations
│   ├── sw.js            # Service Worker
│   └── manifest.json    # PWA Manifest
├── index.html           # Main application entry point
├── server.js            # Express server and Socket.io events
└── package.json         # Project metadata and scripts