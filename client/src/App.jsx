import React, { useState, useCallback } from 'react';
import axios from 'axios';
import SpecForm from './components/SpecForm.jsx';
import CodeDisplay from './components/CodeDisplay.jsx';
import LoadingSpinner from './components/LoadingSpinner.jsx';
// Optional: import logo from './assets/logo.svg';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState(null);
  const [error, setError] = useState(null);

  const handleGenerate = useCallback(async (specifications) => {
    setIsLoading(true);
    setGeneratedCode(null);
    setError(null);

    try {
      const response = await axios.post('/api/generate', specifications);

      // Validate response structure
      if (
        response &&
        response.data &&
        typeof response.data.code === 'string'
      ) {
        setGeneratedCode(response.data.code);
      } else {
        console.error('Invalid API response structure:', response);
        setError('Received an invalid response from the server.');
      }
    } catch (err) {
      console.error('API Error:', err); // Log the full error for debugging

      // Determine user-friendly error message
      let userErrorMessage = 'An error occurred while generating the application. Please check the details and try again.'; // Generic fallback

      if (err.response && err.response.data && typeof err.response.data.error === 'string') {
        // Use backend-provided error message if available and seems safe
        // Basic check to avoid displaying overly technical or sensitive info
        const backendError = err.response.data.error;
        if (backendError && !backendError.toLowerCase().includes('exception') && !backendError.toLowerCase().includes('trace')) {
           // More specific errors based on status codes or backend messages
            if (err.response.status === 400) {
                userErrorMessage = `Invalid input: ${backendError}`;
            } else if (err.response.status === 429) {
                userErrorMessage = `Rate limit exceeded. Please try again later. (${backendError})`;
            } else if (err.response.status >= 500) {
                userErrorMessage = `Server error: ${backendError}. Please try again later.`;
            } else {
                 userErrorMessage = backendError; // Use sanitized backend error
            }
        }
      } else if (err.request) {
        // The request was made but no response was received
        userErrorMessage = 'Could not connect to the generation service. Please check your connection or try again later.';
      }
      // else: Something happened in setting up the request that triggered an Error (handled by generic fallback)

      setError(userErrorMessage);
    } finally {
      // Ensure loading state is always turned off
      setIsLoading(false);
    }
  }, []); // No dependencies, useCallback ensures function identity remains stable

  return (
    <div className="min-h-screen flex flex-col items-center p-4 sm:p-8 bg-gray-100 text-gray-800">
      {/* Optional Logo */}
      {/* <img src={logo} alt="AI App Builder Logo" className="h-16 w-auto mb-4" /> */}
      <h1 className="text-3xl sm:text-4xl font-bold my-4 text-center">
        AI App Builder MVP
      </h1>
      <p className="text-center mb-6 max-w-xl">
        Describe your simple web application idea, and let AI generate the basic code structure for you.
      </p>

      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-md mb-8">
        <SpecForm onSubmit={handleGenerate} isLoading={isLoading} />
      </div>

      {isLoading && (
        <div className="my-4 flex justify-center">
          <LoadingSpinner />
        </div>
      )}

      {error && (
        <div className="w-full max-w-4xl my-4 text-red-700 bg-red-100 border border-red-400 p-4 rounded shadow-md text-center">
          <p><strong>Error:</strong> {error}</p>
        </div>
      )}

      {generatedCode && !isLoading && !error && (
        <div className="w-full max-w-4xl mt-4">
          <CodeDisplay code={generatedCode} />
        </div>
      )}
    </div>
  );
}

export default App;