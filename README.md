# Sticker Collection App

A web application for collecting and managing stickers, built with React and Node.js.

## Project Structure

```
sticker-app/
├── client/          # React frontend
├── server/          # Node.js backend
└── docker-compose.yml
```

## Features

- View your sticker collection
- Add new random stickers
- Delete stickers from your collection
- Different rarity levels for stickers
- Responsive grid layout

## Prerequisites

- Node.js (v14 or higher)
- Docker and Docker Compose
- MongoDB

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/sticker-app.git
cd sticker-app
```

2. Set up environment variables:
   - Copy `.env.example` to `.env` in the server directory
   - Update the variables as needed

3. Start the application using Docker Compose:
```bash
docker-compose up
```

Or run locally:

4. Install dependencies:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

5. Start the development servers:
```bash
# Start the server (from server directory)
npm run dev

# Start the client (from client directory)
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Development

- Frontend is built with React
- Backend is built with Node.js and Express
- MongoDB is used as the database
- Docker is used for containerization

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 