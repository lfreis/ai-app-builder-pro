<div class="hero-icon" align="center">
  <img src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/ec559a9f6bfd399b82bb44393651661b08aaf7ba/icons/folder-markdown-open.svg" width="100" />
</div>

<h1 align="center">
AI App Builder MVP
</h1>
<h4 align="center">A web application that leverages LLMs to generate basic web application code via a simplified interface.</h4>
<h4 align="center">Developed with the software and tools below.</h4>
<div class="badges" align="center">
  <img src="https://img.shields.io/badge/Framework-React%20%26%20Express-blue" alt="Framework: React & Express">
  <img src="https://img.shields.io/badge/Frontend-React_19,_Tailwind_CSS_4-red" alt="Frontend: React 19, Tailwind CSS 4">
  <img src="https://img.shields.io/badge/Backend-Node.js_20+,_Express_5-blue" alt="Backend: Node.js 20+, Express 5">
  <img src="https://img.shields.io/badge/LLMs-OpenAI%20(GPT--3.5--Turbo)-black" alt="LLMs: OpenAI (GPT-3.5-Turbo)">
</div>
<div class="badges" align="center">
  <img src="https://img.shields.io/github/last-commit/coslynx/ai-app-builder-mvp?style=flat-square&color=5D6D7E" alt="git-last-commit" />
  <img src="https://img.shields.io/github/commit-activity/m/coslynx/ai-app-builder-mvp?style=flat-square&color=5D6D7E" alt="GitHub commit activity" />
  <img src="https://img.shields.io/github/languages/top/coslynx/ai-app-builder-mvp?style=flat-square&color=5D6D7E" alt="GitHub top language" />
</div>

## 📑 Table of Contents
- 📍 Overview
- 📦 Features
- 📂 Structure
- 💻 Installation
- 🏗️ Usage
- 🌐 Hosting
- 📄 API Documentation
- 📜 License & Attribution
- 👏 Authors

## 📍 Overview
The AI App Builder MVP is a web application designed to simplify the initial stages of web development. Users can describe their application idea through a simple interface, providing a name, description, and key features. The backend then utilizes an OpenAI Large Language Model (LLM) to generate basic, functional HTML, CSS, and JavaScript code corresponding to the user's input. This MVP serves as a rapid prototyping tool, allowing both developers and non-developers to quickly visualize simple web applications and obtain starter code without writing it manually.

## 📦 Features
|    | Feature            | Description                                                                                                        |
|----|--------------------|--------------------------------------------------------------------------------------------------------------------|
| ⚙️ | **Architecture**   | Client-Server architecture: React 19 SPA frontend interacting with a Node.js/Express 5 backend API. Backend communicates with the OpenAI API.             |
| 📄 | **Documentation**  | This README provides an overview, setup instructions, usage guide, API details, and project structure.              |
| 🔗 | **Dependencies**   | Key dependencies include React, Axios, Tailwind CSS for the client, and Express, OpenAI SDK, dotenv, cors for the server. Uses Vite for frontend tooling and Vitest for testing. |
| 🧩 | **Modularity**     | Clear separation between frontend (`client`) and backend (`server`). Backend uses distinct routes and services (`llmService`). Frontend utilizes reusable components (`Button`, `CodeDisplay`, `LoadingSpinner`, `SpecForm`). |
| 🧪 | **Testing**        | Includes unit tests for key components (e.g., `Button.jsx`) and services (e.g., `llmService.js`) using Vitest and React Testing Library. Setup configured in `vite.config.js`. |
| ⚡️  | **Performance**    | Frontend performance relies on React and Vite optimizations. Backend performance is largely dependent on the response time of the OpenAI API. Basic Express setup is lightweight. |
| 🔐 | **Security**       | Basic security measures include using `.env` for API key management (crucial to keep secure) and CORS middleware on the backend. Requires further hardening for production (input sanitization, rate limiting, etc.). |
| 🔀 | **Version Control**| Git is used for version control. `.gitignore` is configured to exclude sensitive files (`.env`) and build artifacts (`node_modules`, `dist`). |
| 🔌 | **Integrations**   | Frontend integrates with the backend via REST API calls (`axios`). Backend integrates with the external OpenAI API using the official SDK. |
| 📶 | **Scalability**    | The MVP provides a basic structure. Scalability depends on standard Node.js/React practices, infrastructure choices, and OpenAI API limits. The stateless nature of the backend API aids scalability. |

## 📂 Structure
```text
{
  "client": {
    "public": {
      "favicon.ico": null,
      "index.html": null
    },
    "src": {
      "assets": {
        "logo.svg": null
      },
      "components": {
        "SpecForm.jsx": null,
        "CodeDisplay.jsx": null,
        "LoadingSpinner.jsx": null,
        "Button.jsx": null
      },
      "styles": {
        "global.css": null
      },
      "App.jsx": null,
      "main.jsx": null
    },
    "vite.config.js": null,
    "tailwind.config.js": null,
    "postcss.config.js": null,
    "package.json": null
  },
  "server": {
    "src": {
      "services": {
        "llmService.js": null
      },
      "routes": {
        "generate.route.js": null
      },
      "server.js": null
    },
    "package.json": null
  },
  "tests": {
    "client": {
      "components": {
        "Button.test.jsx": null
      }
    },
    "server": {
      "services": {
        "llmService.test.js": null
      }
    }
  },
  ".env": null,
  ".gitignore": null,
  "README.md": null,
  "package.json": null,
  "startup.sh": null,
  "commands.json": null
}
```

## 💻 Installation
 > [!WARNING]
 > ### 🔧 Prerequisites
 > - Node.js >= 20.0.0
 > - npm (usually included with Node.js)
 > - Git

 ### 🚀 Setup Instructions
 1. Clone the repository:
    ```bash
    git clone https://github.com/coslynx/ai-app-builder-mvp.git
    cd ai-app-builder-mvp
    ```
 2. Install all dependencies for root, client, and server:
    ```bash
    npm run install-all
    ```
 3. Configure environment variables:
    - Create a `.env` file in the project root directory by copying `.env.example` (if it exists) or creating it manually.
    - Add the following variables:
      ```env
      # Port for the backend server (default is 3001)
      PORT=3001

      # Your OpenAI API Key (REQUIRED)
      # Get one from https://platform.openai.com/api-keys
      OPENAI_API_KEY="sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
      ```
    > [!IMPORTANT]
    > Replace `"sk-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"` with your actual OpenAI API key. Keep this file secure and do **not** commit it to version control. The `.gitignore` file should already be configured to prevent this.

## 🏗️ Usage
### 🏃‍♂️ Running the MVP
1.  Start both the client and server development servers concurrently:
    ```bash
    npm run dev
    ```
    This command uses `concurrently` to run `vite` (for the client) and `nodemon src/server.js` (for the server).

2.  Access the application:
    *   Frontend (Client): Open your browser to [http://localhost:5173](http://localhost:5173) (or the port specified by Vite if 5173 is busy).
    *   Backend API: The server runs on port 3001 (or the `PORT` specified in `.env`), accessible at [http://localhost:3001](http://localhost:3001). The API endpoint used by the client is `/api/generate`.

> [!TIP]
> ### ⚙️ Configuration
> - **Backend Port:** Modify the `PORT` variable in the `.env` file to change the port the backend server listens on. Remember to update the proxy target in `client/vite.config.js` if you change this during development.
> - **OpenAI API Key:** The `OPENAI_API_KEY` variable in the `.env` file is essential for connecting to the OpenAI service. Ensure it's set correctly.
> - **LLM Model:** The model used (`gpt-3.5-turbo`) is hardcoded in `server/src/services/llmService.js`. You can change this to other compatible models if needed.

### 📚 Examples
1.  **Using the UI:**
    *   Navigate to [http://localhost:5173](http://localhost:5173).
    *   Fill in the "Application Name", "Application Description", and "Key Features" (one per line) fields in the form.
    *   Click the "Generate Application" button.
    *   Wait for the loading spinner to disappear.
    *   The generated HTML, CSS, and JavaScript code will appear in the code display area below the form.
    *   If an error occurs, an error message will be displayed instead.

2.  **Using `curl` (Direct API Call):**
    ```bash
    curl -X POST http://localhost:3001/api/generate \
         -H "Content-Type: application/json" \
         -d '{
               "appName": "My Test App",
               "appDescription": "A simple counter app",
               "features": ["Increment button", "Decrement button", "Display current count"]
             }'
    ```
    **Expected Success Response (Structure):**
    ```json
    {
      "code": "/* file: index.html */\n<h1>My Test App</h1>\n<p>Current Count: <span id=\"count\">0</span></p>\n<button id=\"increment\">+</button>\n<button id=\"decrement\">-</button>\n<script src=\"script.js\"></script>\n\n/* file: style.css */\nbody { font-family: sans-serif; }\nbutton { margin: 5px; padding: 10px; }\n\n/* file: script.js */\nlet count = 0;\nconst countDisplay = document.getElementById('count');\nconst incrementBtn = document.getElementById('increment');\nconst decrementBtn = document.getElementById('decrement');\n\nincrementBtn.addEventListener('click', () => {\n  count++;\n  countDisplay.textContent = count;\n});\n\ndecrementBtn.addEventListener('click', () => {\n  count--;\n  countDisplay.textContent = count;\n});\n"
    }
    ```
    **Expected Error Response (Example - Invalid Input):**
    ```json
    {
      "error": "Invalid specifications provided."
    }
    ```

## 🌐 Hosting
### 🚀 Deployment Instructions
This MVP consists of a static React frontend and a Node.js backend. You can deploy them separately or together.

**General Steps:**

1.  **Build the Client:**
    ```bash
    npm run build:client
    ```
    This creates a `dist` folder inside the `client` directory containing optimized static assets (HTML, CSS, JS).

2.  **Deploy the Client:**
    *   Host the contents of the `client/dist` folder on any static hosting provider like:
        *   Vercel
        *   Netlify
        *   GitHub Pages
        *   AWS S3 + CloudFront
    *   Configure routing rules if using client-side routing (not applicable for this simple MVP) to redirect all paths to `index.html`.

3.  **Deploy the Server:**
    *   Host the `server` directory as a Node.js application on platforms like:
        *   Render
        *   Fly.io
        *   Heroku (check for free tier limitations)
        *   AWS Elastic Beanstalk
        *   DigitalOcean App Platform
        *   A traditional VPS
    *   Ensure the server environment has Node.js >= 20 installed.
    *   Set the required environment variables (see below) in the hosting provider's settings.
    *   Use `npm start` (which runs `node src/server.js`) as the start command. Ensure production dependencies are installed (`npm install --production --prefix server` or similar, depending on the platform).
    *   Configure CORS appropriately on the server (`server/src/server.js`) for your frontend's production URL. Currently, it allows all origins (`app.use(cors())`), which might be too permissive for production. Consider restricting it: `app.use(cors({ origin: 'YOUR_FRONTEND_URL' }));`.

### 🔑 Environment Variables
Ensure the following environment variables are set in your production server environment:

-   `NODE_ENV`: Set to `production` for performance optimizations and proper error handling in Express.
-   `PORT`: The port your server should listen on (provided by the hosting platform, e.g., `8080`, `10000`).
-   `OPENAI_API_KEY`: Your secret OpenAI API key. **Crucial for functionality.**
-   (Optional) `CORS_ORIGIN`: If you restrict CORS, set this to your frontend's deployed URL (e.g., `https://myapp.vercel.app`). The `server.js` would need modification to use this variable.

## 📄 API Documentation
### 🔍 Endpoints

-   **`POST /api/generate`**
    -   **Description:** Takes application specifications as input and returns AI-generated code.
    -   **Request Body:** JSON object containing application details.
        ```json
        {
          "appName": "string (optional, defaults provided)",
          "appDescription": "string (optional, defaults provided)",
          "features": ["string", "string", ...] // Array of strings (optional, defaults provided)
        }
        ```
    -   **Response (Success - 200 OK):** JSON object containing the generated code.
        ```json
        {
          "code": "string" // Contains the generated HTML, CSS, JS code
        }
        ```
    -   **Response (Error):**
        *   `400 Bad Request`: Invalid request body or specifications (`{ "error": "Invalid or missing request body." }` or `{ "error": "Invalid specifications provided." }`).
        *   `429 Too Many Requests`: OpenAI rate limit exceeded (`{ "error": "Rate limit exceeded. Please try again later." }`).
        *   `500 Internal Server Error`: Unexpected server error or OpenAI authentication issue (`{ "error": "An unexpected error occurred..." }` or `{ "error": "Internal server error... [Auth Issue]" }`).
        *   `502 Bad Gateway`: Invalid response received from the LLM service (`{ "error": "Failed to get valid response..." }`).
        *   `503 Service Unavailable`: OpenAI API communication issues (`{ "error": "Code generation service temporarily unavailable." }`).

### 🔒 Authentication
The `/api/generate` endpoint itself does not require user authentication for this MVP. However, the backend service (`llmService.js`) requires a valid `OPENAI_API_KEY` set as an environment variable on the server to authenticate with the OpenAI API. This key is **not** exposed to the client.

### 📝 Examples
See the `curl` example in the [Usage](#️-usage) section.

> [!NOTE]
> ## 📜 License & Attribution
>
> ### 📄 License
> This Minimum Viable Product (MVP) is licensed under the [GNU AGPLv3](https://choosealicense.com/licenses/agpl-3.0/) license.
>
> ### 🤖 AI-Generated MVP
> This MVP was entirely generated using artificial intelligence through [CosLynx.com](https://coslynx.com).
>
> No human was directly involved in the coding process of the repository: ai-app-builder-mvp
>
> ### 📞 Contact
> For any questions or concerns regarding this AI-generated MVP, please contact CosLynx at:
> - Website: [CosLynx.com](https://coslynx.com)
> - Twitter: [@CosLynxAI](https://x.com/CosLynxAI)

<p align="center">
  <h1 align="center">🌐 CosLynx.com</h1>
</p>
<p align="center">
  <em>Create Your Custom MVP in Minutes With CosLynxAI!</em>
</p>
<div class="badges" align="center">
<img src="https://img.shields.io/badge/Developers-Drix10,_Kais_Radwan-red" alt="">
<img src="https://img.shields.io/badge/Website-CosLynx.com-blue" alt="">
<img src="https://img.shields.io/badge/Backed_by-Google,_Microsoft_&_Amazon_for_Startups-red" alt="">
<img src="https://img.shields.io/badge/Finalist-Backdrop_Build_v4,_v6-black" alt="">
</div>