import OpenAI from 'openai';
import {
  APIError,
  AuthenticationError,
  RateLimitError
} from 'openai';

// Retrieve the OpenAI API key from environment variables
const apiKey = process.env.OPENAI_API_KEY;

// Check for the presence of the API key upon module initialization
if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '' || apiKey === 'YOUR_OPENAI_API_KEY_HERE') {
  console.error('FATAL ERROR: OpenAI API key is missing or invalid. Please check your .env file and ensure OPENAI_API_KEY is set correctly.');
  // Throwing here will prevent the server from starting successfully if the key is missing
  throw new Error('OpenAI API key is missing or invalid.');
}

// Instantiate the OpenAI client once within the module scope
const openai = new OpenAI({
  apiKey: apiKey
});

const SYSTEM_PROMPT = `You are an expert MVP developer generating code for a simple web application.
Output only the raw code (HTML, CSS, JavaScript).
Structure the output clearly, using comments like /* file: index.html */, /* file: style.css */, /* file: script.js */ before each section.
Do not include explanations, notes, or markdown formatting (like \`\`\`) around the code blocks.
Focus on creating functional, basic code suitable for a Minimum Viable Product.
Ensure the generated HTML references the CSS and JavaScript files correctly if generated separately.
Prioritize simplicity and core functionality based on the user's request.`;

/**
 * Generates application code using the OpenAI API based on provided specifications.
 * @param {object} specifications - An object containing user requirements (e.g., { appName: string, description: string, features: string[] }).
 * @returns {Promise<string>} A promise that resolves with the generated code string.
 * @throws {Error} Throws an error if API key is missing, specifications are invalid, API call fails, or response is invalid.
 */
export async function generateAppCode(specifications) {
  // Basic input validation
  if (!specifications || typeof specifications !== 'object' || specifications === null) {
    throw new Error('Invalid specifications provided.');
  }

  // Destructure specifications for prompt construction (handle potential missing keys gracefully)
  const appName = specifications.appName || 'My Simple App';
  const description = specifications.description || 'A basic web application.';
  const features = Array.isArray(specifications.features) ? specifications.features : [];
  const featureList = features.length > 0 ? features.join(', ') : 'basic functionality described.';

  // Construct the user prompt dynamically
  const userPrompt = `Create a simple web app named '${appName}'.
Description: '${description}'.
Key features: ${featureList}.
Generate the necessary HTML (index.html), CSS (style.css), and JavaScript (script.js).
Remember to structure the output with /* file: ... */ comments before each section.`;

  try {
    // Call the OpenAI Chat Completions API
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // Suitable model for MVP balancing cost/capability
      messages: [{
          role: 'system',
          content: SYSTEM_PROMPT
        },
        {
          role: 'user',
          content: userPrompt
        },
      ],
      max_tokens: 2048, // Limit response length
      temperature: 0.3, // Lower temperature for more deterministic code output
      n: 1, // Request a single completion
    });

    // Validate the API response structure and content
    if (
      !response ||
      !response.choices ||
      response.choices.length === 0 ||
      !response.choices[0].message ||
      !response.choices[0].message.content ||
      response.choices[0].message.content.trim() === ''
    ) {
      console.error('Invalid response structure received from OpenAI:', response);
      throw new Error('LLM returned an empty or invalid response.');
    }

    // Extract and return the generated code string
    const generatedCode = response.choices[0].message.content;
    return generatedCode;

  } catch (error) {
    // Log the specific error for internal debugging
    console.error('OpenAI API Error:', error);

    // Check error type and throw a more generic, user-friendly error
    if (error instanceof AuthenticationError) {
      // This often indicates an invalid API key
      throw new Error('OpenAI authentication failed. Verify your API key.');
    } else if (error instanceof RateLimitError) {
      // Indicates the API rate limit has been exceeded
      throw new Error('OpenAI rate limit exceeded. Please try again later.');
    } else if (error instanceof APIError) {
      // Handle other generic OpenAI API errors
      throw new Error(`Failed to generate code due to an OpenAI API issue (Status: ${error.status}).`);
    } else if (error.message === 'Invalid specifications provided.') {
      // Re-throw validation error
      throw error;
    } else if (error.message === 'LLM returned an empty or invalid response.') {
        // Re-throw response validation error
        throw error;
    }
    else {
      // Handle network errors or other unexpected issues
      throw new Error('Failed to communicate with OpenAI API.');
    }
  }
}