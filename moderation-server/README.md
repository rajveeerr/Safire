<div align="center">
  <a href="https://safire-five.vercel.app/" target="_blank">
    <img src="https://raw.githubusercontent.com/rajveeerr/Safire/main/client/src/assets/Safire.svg" alt="Safire Logo" width="200"/>
  </a>
  <h2 align="center">Safire AI Moderation Server</h2>
</div>

This is a lightweight microservice responsible for AI-powered text analysis using the Google Gemini API.

### 🚀 Local Setup

1.  **Navigate to the directory:**
    ```sh
    cd moderation-server
    ```
2.  **Install dependencies:**
    ```sh
    npm install
    ```
3.  **Environment Variables**:
    Create a `.env` file from `.env.example` and add your `GEMINI_API_KEY`.
    ```sh
    cp .env.example .env
    ```
4.  **Start the server:**
    ```sh
    npm run dev
    ```

The moderation server will be available at `http://localhost:300x` (or as specified in your `.env`).