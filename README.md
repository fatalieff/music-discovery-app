# 🎵 Music Discovery App

A sleek, modern music recognition web application built with **React**, and the **AudD Music Recognition API**. This app allows users to identify songs playing around them with just one click, featuring a responsive design and real-time audio processing.



## ✨ Features

- **Real-time Identification:** Captures audio through the microphone and identifies songs within seconds.
- **High-Fidelity Audio:** Configured to bypass browser audio filters (echo cancellation, noise suppression) for better recognition accuracy.
- **Spotify Integration:** Direct links to play identified songs on Spotify.
- **Responsive UI:** Beautifully designed with Tailwind CSS, featuring glassmorphism effects and smooth animations.
- **Visual Feedback:** Pulse animations during recording and fade-in effects for results.

## 🚀 Technologies Used

* **Frontend:** React.js
* **API:** AudD Music Recognition API
* **State Management:** React Hooks (useState, useRef)
* **Audio Processing:** Web Audio API & MediaRecorder API

## 🛠️ Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/fatalieff/music-discovery-app.git]
    cd music-discovery-app
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Get your API Key:**
    - Sign up at [audd.io](https://audd.io/) to get your free API Token.
    - Replace the `API_TOKEN` variable in `App.js` with your actual key.

4.  **Run the application:**
    ```bash
    npm start
    ```

## 📝 How it Works

1.  The user clicks the **FIND** button.
2.  The browser requests microphone access with specific constraints (`echoCancellation: false`) to capture the purest audio signal.
3.  The `MediaRecorder` API captures a 10-second audio snippet.
4.  The audio is converted into a `Blob` and sent to the **AudD API** via a `POST` request.
5.  The app parses the JSON response and displays the song title, artist, and album art.

## ⚠️ Requirements

- The app must be served over **HTTPS** or **localhost** for microphone access to work.
- Recommended to use modern browsers like Chrome or Firefox.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

---
Developed with ❤️ by [Mourad Fatalief]