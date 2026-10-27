# SpeechNote AI 🎙️

A real-time speech-to-text application that converts spoken words into text using the Gemini Live API. Built with React, TypeScript, NestJS, Prisma, and MySQL.

## ✨ Features

- **Real-time transcription:** Convert speech into text while speaking.
- **Multilingual input:** Speak naturally in English, Hindi, or a mix of languages.
- **Transcript history:** Save transcripts and access them later.
- **CRUD operations:** Create, view, update, and delete saved transcripts.
- **Persistent storage:** Store transcript content and metadata in MySQL.
- **Responsive UI:** Clean interface designed for desktop and mobile screens.
- **Secure API key handling:** Gemini API credentials remain on the backend.

## 🛠️ Tech Stack

**Frontend**
- React
- TypeScript
- Vite
- CSS

**Backend**
- NestJS
- TypeScript
- Gemini Live API
- Prisma ORM

**Database**
- MySQL

## 📁 Project Structure

```text
speechnote-ai/
├── client/                 # React frontend
│   └── src/
│       ├── components/     # Reusable UI components
│       ├── services/       # API and audio services
│       ├── App.tsx
│       └── App.css
├── server/                 # NestJS backend
│   ├── prisma/             # Database schema and migrations
│   ├── src/
│   │   ├── prisma/         # Prisma service and module
│   │   └── transcripts/    # Transcript CRUD endpoints
│   ├── .env.example
│   └── prisma7.config.ts
├── .gitignore
└── README.md
```

## ⚙️ Prerequisites

Install the following before running the project:

- Node.js and npm
- MySQL Server
- A Gemini API key from [Google AI Studio](https://aistudio.google.com/)

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/speechnote-ai.git
cd speechnote-ai
```

Replace `YOUR_USERNAME` with your GitHub username.

### 2. Configure the database

Create a MySQL database:

```sql
CREATE DATABASE speechnote_ai;
```

Create a dedicated MySQL user and grant it access to the database. Use your own secure password.

### 3. Configure the backend

Navigate to the server directory:

```bash
cd server
npm install
```

Create your environment file from the example:

```bash
cp .env.example .env
```

Update `server/.env` with your actual credentials:

```dotenv
GEMINI_API_KEY=your_gemini_api_key
DATABASE_URL="mysql://speechnote_user:your_mysql_password@localhost:3306/speechnote_ai"
```

Never commit your actual `.env` file or expose your API key.

### 4. Set up Prisma

Run the database migrations and generate the Prisma client:

```bash
npx prisma migrate deploy
npx prisma generate
```

Ensure the MySQL server is running and the database credentials are correct.

### 5. Start the backend

From the `server` directory:

```bash
npm run start:dev
```

The backend runs at:

`http://localhost:3000`

### 6. Start the frontend

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

Open the local URL printed by Vite, typically:

`http://localhost:5173`

Allow microphone access when prompted to use live transcription.

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Check backend health |
| GET | `/gemini/token` | Obtain a temporary Gemini session token |
| POST | `/transcripts` | Create a transcript |
| GET | `/transcripts` | Retrieve all transcripts |
| GET | `/transcripts/:id` | Retrieve a transcript by ID |
| PATCH | `/transcripts/:id` | Update a transcript |
| DELETE | `/transcripts/:id` | Delete a transcript |

## 🔐 Security Notes

- Keep API keys and database credentials in environment variables.
- Never commit `.env` files.
- Use a dedicated database user with only the permissions required by the application at runtime.
- Configure production CORS settings to allow only trusted frontend origins.
- Use HTTPS and secure environment-variable storage when deploying.

## 🧠 How It Works

1. The React frontend requests a temporary session token from the NestJS backend.
2. The frontend captures microphone audio and connects to the Gemini Live API.
3. Transcribed text appears in the interface in real time.
4. Users can save their transcripts through the backend REST API.
5. NestJS uses Prisma to store and retrieve transcript records in MySQL.

## 📌 Project Status

The core application supports live transcription and transcript CRUD operations. Deployment details will be added once the application is hosted.

## 👨‍💻 Author

**Mubashir**

- GitHub: [Mubashir15700](https://github.com/Mubashir15700)
