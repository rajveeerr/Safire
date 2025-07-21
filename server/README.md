<div align="center">
  <a href="https://safire-five.vercel.app/" target="_blank">
    <img src="https://raw.githubusercontent.com/rajveeerr/Safire/main/client/src/assets/Safire.svg" alt="Safire Logo" width="200"/>
  </a>
  <h2 align="center">Safire Main Backend Server</h2>
</div>

This is the main backend for the **Safire** project, handling user authentication, data storage, evidence management, and report generation.  
Built with **Node.js**, **Express**, and **MongoDB**.

---

## Getting Started

### 1. Installation

Navigate to the `server` directory and install the required dependencies:

```sh
cd server
npm install
````

---

### 2. Environment Variables

Create a `.env` file in the server directory by copying the example:

```sh
cp .env.example .env
```

Now, fill in the required fields in your `.env` file:

| Variable                    | Description                                                                    |
| --------------------------- | ------------------------------------------------------------------------------ |
| `mongoConnectionString`     | Your MongoDB connection string.                                                |
| `JWT_SECRET`                | A long, random secret used to sign JWT tokens.                                 |
| `PUPPETEER_EXECUTABLE_PATH` | (Optional) Path to your Chrome/Chromium executable if Puppeteer can't find it. |

---

### 3. Run the Server

Start the development server using Nodemon:

```sh
npm run dev
```

The server will run on:
📍 `http://localhost:3001` (or the port you set in your `.env` file)

---

## 🧪 API Testing with Postman

We’ve created a public Postman workspace so you can test all the APIs locally.

### How to Test:

1. **Open the Workspace:**
   Click below to access the Postman collection:

   [![Run in Postman](https://run.pstmn.io/button.svg)](https://msit-hackers.postman.co/workspace/MSIT-Hackers-Workspace~72080528-2154-4588-b837-a449f8a26caa/collection/38038413-53a654db-930f-4abe-8208-f2767a9024e8?action=share&source=copy-link&creator=38038413)

2. **Fork the Collection:**
   Fork the **"Safire"** collection into your Postman account.

3. **Configure Environment:**
   Create a local environment in Postman with the following variable:

   * `baseURL`: `http://localhost:3001`

You’re now ready to test endpoints like **authentication**, **report generation**, and more.

---
