import { Router } from 'express';
import { generateAppCode } from '../services/llmService.js';

// Create an instance of Express Router
const router = Router();

// Define the route handler for POST /api/generate
router.post('/', async (req, res) => {
  // Validate request body structure and basic types
  const { body } = req;

  if (!body || typeof body !== 'object' || body === null) {
    return res.status(400).json({ error: 'Invalid or missing request body.' });
  }

  // Optional: Basic type checks for expected fields.
  // llmService has defaults, but this catches fundamentally incorrect structures earlier.
  if (body.appName && typeof body.appName !== 'string') {
    return res.status(400).json({ error: 'Invalid type for appName, expected string.' });
  }
  if (body.description && typeof body.description !== 'string') {
    return res.status(400).json({ error: 'Invalid type for description, expected string.' });
  }
  if (body.features && !Array.isArray(body.features)) {
    return res.status(400).json({ error: 'Invalid type for features, expected array.' });
  }
  // Add more specific checks if needed (e.g., feature array elements are strings)

  try {
    // Call the llmService to generate application code
    const generatedCode = await generateAppCode(body);

    // Respond with the generated code on success
    res.status(200).json({ code: generatedCode });

  } catch (error) {
    // Log the caught error for server-side debugging
    console.error('Error in /api/generate route:', error.message); // Log message for clarity

    // Map specific known errors from llmService to client-friendly responses
    if (error.message === 'Invalid specifications provided.') {
      // This error originates from llmService's own input validation
      return res.status(400).json({ error: 'Invalid specifications provided.' });
    } else if (error.message === 'LLM returned an empty or invalid response.') {
      // Error indicating the LLM response wasn't usable
      return res.status(502).json({ error: 'Failed to get valid response from generation service.' });
    } else if (error.message === 'OpenAI authentication failed. Verify your API key.') {
      // Specific error for authentication issues (e.g., invalid key)
      // Send 500 as it's an internal configuration/setup issue from client perspective
      return res.status(500).json({ error: 'Internal server error during code generation. [Auth Issue]' });
    } else if (error.message === 'OpenAI rate limit exceeded. Please try again later.') {
      // Specific error for hitting rate limits
      return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    } else if (error.message.startsWith('Failed to generate code due to an OpenAI API issue')) {
      // Generic OpenAI API errors (other than auth/rate limit)
      return res.status(503).json({ error: 'Code generation service temporarily unavailable.' });
    } else if (error.message === 'Failed to communicate with OpenAI API.') {
      // Network or other communication errors connecting to OpenAI
      return res.status(503).json({ error: 'Code generation service temporarily unavailable.' });
    } else {
      // Catch-all for any other unexpected errors
      // Avoid sending raw error details to the client
      return res.status(500).json({ error: 'An unexpected error occurred during code generation.' });
    }
    // Note: We are handling the response here, so we DON'T call next(error).
    // The global error handler in server.js is for truly unhandled exceptions.
  }
});

// Export the configured router
export default router;