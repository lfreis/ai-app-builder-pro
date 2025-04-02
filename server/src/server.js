import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import generateRoute from './routes/generate.route.js';

// Load environment variables from .env file
dotenv.config();

// Create Express application instance
const app = express();

// Apply middleware
// Enable Cross-Origin Resource Sharing for all origins (default)
app.use(cors());
// Parse incoming requests with JSON payloads
app.use(express.json());

// Define a basic root route for health checks or basic info
app.get('/', (req, res) => {
  res.send('AI App Builder Server is running!');
});

// Mount the API routes
// All routes defined in generate.route.js will be prefixed with /api
app.use('/api', generateRoute);

// Define the port
// Reads from environment variable PORT, defaults to 3001 if not set
const PORT = process.env.PORT || 3001;

// Global error handling middleware
// This MUST be the last middleware added
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // Log the error stack trace to the console for debugging
  console.error(err.stack);

  // Send a generic 500 Internal Server Error response
  res.status(500).json({ error: 'Internal Server Error' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

// Optional: Export the app instance for potential testing scenarios
export default app;