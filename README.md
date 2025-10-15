# 🎧 Meeting Summarizer — Unthinkable

**Meeting Summarizer** is a lightweight, intelligent web app built for **Unthinkable Solutions** that converts meeting recordings into structured insights.  
Powered by **Google Gemini 2.5 Flash**, it transcribes audio, generates concise summaries, and extracts actionable items — all within a modern and minimal UI.

---

## 🚀 Features

- 🧠 **AI-Driven Analysis** – Automatically transcribes, summarizes, and identifies key points from meetings.  
- 🎙️ **Audio Upload Support** – Accepts `.mp3`, `.wav`, and `.m4a` files.  
- ⚡ **Interactive Interface** – Clean dashboard with live progress indicators.  
- ✅ **Action Item Extraction** – Highlights important tasks and follow-ups from the conversation.  
- 🔐 **Privacy-Focused** – Processes only user-selected files and keys; no data stored.

---

## 🏗️ Tech Stack

| Layer | Technologies |
|-------|---------------|
| **Frontend** | React.js |
| **Icons/UI** | Lucide-React Icons, Custom Inline Styling |
| **AI Model** | Google Gemini 2.5 Flash API |
| **Deployment** | GitHub Pages / Vercel (Recommended) |

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the repository
```bash
git clone https://github.com/jai-mathur03/meeting_summary.git
cd meeting_summary
2️⃣ Install dependencies
bash
Copy code
npm install
3️⃣ Start the development server
bash
Copy code
npm run dev
4️⃣ Build for production
bash
Copy code
npm run build
🔑 Get Your API Key
This project uses Google’s AI Studio API (Gemini 2.5 Flash) for summarization.

Go to Google AI Studio

Generate a free API key

Paste it into the app’s API Credentials field before processing an audio file

No .env configuration required — everything runs directly from the browser.

🧩 How It Works
Upload an audio file of your meeting

Enter your API key

Click Analyze Audio

The AI will:

Convert the audio to Base64

Send it securely to Google’s API

Return a formatted response:

🗒 Summary

✅ Action Items

🎧 Full Transcript

📁 Project Structure
php
Copy code
src/
 ├── AudioSummarizer.jsx    # Main component for file handling & API logic
 ├── App.jsx
 ├── index.js
public/
 └── index.html
💼 Example Use Cases
Summarizing company meetings

Capturing interview takeaways

Analyzing podcasts or discussions

Generating notes from brainstorming sessions

🏢 About Unthinkable Solutions
Unthinkable Solutions Pvt. Ltd. is a forward-thinking technology company focused on AI, automation, and enterprise innovation.
This project showcases an intelligent transcription and summarization capability for enterprise-grade meeting analysis.

✨ Author
👤 Jaiaditya Mathur
Final Year CSE | VIT Vellore
📧 jaiaditya.mathur@gmail.com
🌐 GitHub

📜 License
This project is licensed under the MIT License.
Feel free to use, modify, and improve — with attribution.

