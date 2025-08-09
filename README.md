# WebPerf Analyzer

A MERN stack application for analyzing web performance.

## Project Structure

- `client/`: React frontend application.
- `server/`: Node.js/Express backend API.

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- npm or yarn

### Installation

1.  **Clone the repository:**

    ```bash
    git clone <repository-url>
    cd webperf-analyzer
    ```

2.  **Install client dependencies:**

    ```bash
    cd client
    npm install
    cd ..
    ```

3.  **Install server dependencies:**

    ```bash
    cd server
    npm install
    cd ..
    ```

### Running the Application

#### Development

1.  **Start the client:**

    ```bash
    cd client
    npm start
    ```

2.  **Start the server:**

    ```bash
    cd server
    npm run dev
    ```

    The client will typically run on `http://localhost:5173` (Vite default) and the server on `http://localhost:5000` (or as configured).

#### Production Build

1.  **Build the client:**

    ```bash
    cd client
    npm run build
    ```

    This will create a `dist` folder in the `client` directory.

2.  **Start the server (for production):**

    ```bash
    cd server
    npm start
    ```

    Ensure your server is configured to serve the static files from the client's `dist` folder in a production environment.

## Technologies Used

### Client (React)

- React
- React Router DOM
- Axios
- Chart.js
- D3.js
- Web-Vitals
- idb (IndexedDB library)
- Vite

### Server (Node.js/Express)

- Express
- Mongoose (MongoDB ODM)
- CORS
- Dotenv
- Nodemon (for development)

## Folder Structure

```
webperf-analyzer/
├── client/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
├── server/
│   ├── server.js
│   ├── .env
│   └── package.json
├── .gitignore
└── README.md
```
