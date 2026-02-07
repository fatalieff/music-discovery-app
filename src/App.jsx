import "./App.css";
import React, { useState, useRef } from "react";

function App() {
  const [isRecording, setIsRecording] = useState(false);
  const [status, setStatus] = useState("Press the button and play music");
  const [result, setResult] = useState(null);

  const mediaRecorder = useRef(null);
  const audioChunks = useRef([]);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,
          noiseSuppression: false,
          autoGainControl: false,
        },
      });

      //formatı sec
      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/webm";

      mediaRecorder.current = new MediaRecorder(stream, { mimeType });
      audioChunks.current = [];

      mediaRecorder.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data);
        }
      };

      mediaRecorder.current.onstop = async () => {
        const audioBlob = new Blob(audioChunks.current, { type: mimeType });
        identifySong(audioBlob);
      };

      mediaRecorder.current.start();
      setIsRecording(true);
      setStatus("Listening...");

      // 10 saniyə qulaq asmaq tanıma ehtimalını artırır
      setTimeout(() => {
        stopRecording();
      }, 6000);
    } catch (err) {
      console.error("Microphone error:", err);
      setStatus("Microphone access denied!");
    }
  };

  const stopRecording = () => {
    if (mediaRecorder.current && mediaRecorder.current.state === "recording") {
      mediaRecorder.current.stop();
      setIsRecording(false);
      setStatus("Analyzing song...");
    }
  };

  const identifySong = async (blob) => {
    const API_TOKEN = String(import.meta.env.VITE_AUDD_API_TOKEN ?? "").trim();
    if (!API_TOKEN) {
      setStatus(
        "VITE_AUDD_API_TOKEN not loaded. Add it to .env in project root, then restart dev server (npm run dev).",
      );
      setResult(null);
      return;
    }
    const formData = new FormData();

    // API-yə mikrofondan gələn faylı göndəririk
    formData.append("file", blob, "recording.wav");
    formData.append("api_token", API_TOKEN);
    formData.append("return", "spotify,apple_music");

    try {
      // URL-dən test linkini sildik, təmiz API ünvanına müraciət edirik
      const response = await fetch("https://api.audd.io/", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Full API Response:", data);
      if (data.status === "error") {
        const msg =
          data.error?.error_message || data.error?.message || "API error";
        const code = data.error?.error_code;
        const isAuthError =
          /api_token|authorization|invalid|inactive|trial|subscription/i.test(
            msg,
          );
        if (code === 700) {
          setStatus("Audio not received. Use HTTPS and multipart/form-data.");
        } else if (code === 500) {
          setStatus("Invalid audio format. Try recording again.");
        } else if (code === 400) {
          setStatus("Audio too long. Record under 25 seconds.");
        } else if (isAuthError || code === 900 || code === 901) {
          setStatus(
            "Invalid or inactive AudD API token. Get a token at dashboard.audd.io and add VITE_AUDD_API_TOKEN to .env",
          );
        } else {
          setStatus(`Error: ${msg}`);
        }
        setResult(null);
        return;
      }

      if (data.status === "success" && data.result) {
        setResult({
          title: data.result.title,
          artist: data.result.artist,
          image:
            data.result.spotify?.album?.images?.[0]?.url ||
            "https://via.placeholder.com/300",
          link: data.result.spotify?.external_urls?.spotify,
        });
        setStatus("Song found!");
      } else {
        setStatus("Sorry, song not found. Play it louder!");
      }
    } catch (error) {
      console.error("API Error:", error);
      setStatus("Connection error!");
    }
  };

  const handleSearchAgain = () => {
    setResult(null);
    setStatus("Press the button and play music");
  };

  return (
    <div className="flex  items-center justify-center min-h-screen bg-[#0f0c29]">
      <header className="text-center px-4 w-full">
        {!result ? (
          <div className="home-container">
            <h1 className="text-4xl font-bold text-white mb-8 home-title">
              Discover Music
            </h1>

            <button
              className={`find-button ${isRecording ? "listening" : ""}`}
              onClick={isRecording ? stopRecording : startRecording}
            >
              {isRecording ? "LISTENING" : "FIND"}
            </button>

            <p className="text-white text-lg mt-6 status-text">{status}</p>
          </div>
        ) : (
          <div className="result-container">
            <div className="cover-container mt-9">
              <img src={result.image} alt="Cover" className="album-image" />
            </div>
            <h2 className="song-title">{result.title}</h2>
            <p className="song-artist">{result.artist}</p>

            {result.link && (
              <a
                href={result.link}
                target="_blank"
                rel="noreferrer"
                className="spotify-button"
              >
                Open in Spotify
              </a>
            )}

            <div className="search-text-container" onClick={handleSearchAgain}>
              <span className="search-text">Search Again</span>
            </div>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
