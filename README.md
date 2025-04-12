# Scrollee

A versatile media feed aggregator that combines web scraping capabilities with a customizable client interface.

## Project Structure

The project consists of two main workspaces:
- Client: Frontend application for displaying media feeds
- Server: Backend service for web scraping and data aggregation

## Installation

1. Clone the repository
2. Install dependencies using Yarn:
```bash
yarn install
```

This will install dependencies for both workspaces.

## Development
Run client an server concurrently with yarn dev in the root. Client hmr wont work this way

### Client
To run the client with Hot Module Replacement (HMR):
```bash
cd client
yarn serve
```
Note: HMR only works when running the client from its workspace directory.

### Server
To start the server:
```bash
cd server
yarn dev
```

## Features

- Web scraping capabilities for various media sources
- Customizable media feed aggregation
- Real-time updates through HMR during development
- Workspace-based project structure

## Getting Started

1. Set up both client and server
2. Configure your desired media sources
3. Create and customize your personal feed

## License

MIT