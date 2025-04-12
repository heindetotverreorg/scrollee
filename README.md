# TypeScript Express and Vue.js Project

This project is a full-stack application built with TypeScript, Express for the server, and Vue.js for the client. 

## Project Structure

```
typescript-express-app
├── client
│   ├── src
│   │   ├── App.vue
│   │   ├── components
│   │   │   └── HelloWorld.vue
│   │   ├── main.ts
│   │   └── types
│   │       └── index.ts
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts
├── server
│   ├── src
│   │   ├── app.ts
│   │   ├── controllers
│   │   │   └── index.ts
│   │   ├── routes
│   │   │   └── index.ts
│   │   └── types
│   │       └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd typescript-express-app
   ```

2. Install server dependencies:
   ```bash
   cd server
   npm install
   ```

3. Install client dependencies:
   ```bash
   cd client
   npm install
   ```

### Running the Application

1. Start the Express server:
   ```bash
   cd server
   npm run start
   ```

2. Start the Vue.js client:
   ```bash
   cd client
   npm run dev
   ```

### Project Features

- **Express Server**: Handles API requests and serves the Vue.js application.
- **Vue.js Client**: A responsive front-end built with Vue.js, featuring a simple component structure.

### License

This project is licensed under the MIT License.