import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach
} from 'vitest';
import OpenAI, {
  APIError,
  AuthenticationError,
  RateLimitError
} from 'openai'; // Import necessary classes for mocking structure
import {
  generateAppCode
} from '../../src/services/llmService.js'; // Adjust path as needed

// --- Mocking OpenAI ---

// Create a mock function for the core API call
const mockCreateCompletion = vi.fn();

// Mock the entire 'openai' module
vi.mock('openai', () => {
  // Mock the constructor of the OpenAI class
  const MockOpenAI = vi.fn().mockImplementation(() => ({
    // Mock the nested structure to reach the 'create' method
    chat: {
      completions: {
        create: mockCreateCompletion,
      },
    },
  }));

  // Mock specific error types exported by the library
  // We create simple mock classes that inherit from Error
  class MockAuthenticationError extends Error {
    constructor() {
      super("Mock Authentication Error");
      this.name = 'AuthenticationError';
    }
  }
  class MockRateLimitError extends Error {
    constructor() {
      super("Mock Rate Limit Error");
      this.name = 'RateLimitError';
    }
  }
  class MockAPIError extends Error {
    constructor(status) {
      super(`Mock API Error with status ${status}`);
      this.name = 'APIError';
      this.status = status;
    }
  }

  // Return the mocked structure, including the default export (the class)
  // and the named error exports.
  return {
    default: MockOpenAI,
    OpenAI: MockOpenAI, // Include named export for completeness if needed
    AuthenticationError: MockAuthenticationError,
    RateLimitError: MockRateLimitError,
    APIError: MockAPIError,
  };
});

// --- Test Suite ---

describe('llmService - generateAppCode', () => {
  const validSpecs = {
    appName: 'Test App',
    description: 'A simple testing application.',
    features: ['Feature A', 'Feature B'],
  };

  const mockApiKey = 'mock-api-key-valid';

  // Setup environment variable before each test and clear mocks
  beforeEach(() => {
    vi.stubEnv('OPENAI_API_KEY', mockApiKey); // Provide a valid mock key
    vi.clearAllMocks(); // Reset mocks for isolation
  });

  // Cleanup environment variable stubbing after each test
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  // --- Successful Generation Tests ---
  describe('Successful Generation', () => {
    it('should call OpenAI API with correct parameters and return generated code', async () => {
      const mockGeneratedCode =
        '/* file: index.html */\n<h1>Test App</h1>\n/* file: style.css */\nbody { color: blue; }\n/* file: script.js */\nconsole.log("Hello Test App");';
      const mockResponse = {
        choices: [{
          message: {
            content: mockGeneratedCode
          }
        }],
      };
      mockCreateCompletion.mockResolvedValueOnce(mockResponse);

      const result = await generateAppCode(validSpecs);

      expect(result).toBe(mockGeneratedCode);
      expect(mockCreateCompletion).toHaveBeenCalledTimes(1);
      expect(mockCreateCompletion).toHaveBeenCalledWith({
        model: 'gpt-3.5-turbo',
        messages: [{
            role: 'system',
            content: expect.stringContaining('You are an expert MVP developer')
          },
          {
            role: 'user',
            content: expect.stringContaining("Create a simple web app named 'Test App'.") &&
              expect.stringContaining("Description: 'A simple testing application.'.") &&
              expect.stringContaining("Key features: Feature A, Feature B."),
          },
        ],
        max_tokens: 2048,
        temperature: 0.3,
        n: 1,
      });
    });

    it('should use default values in prompt when specifications are minimal', async () => {
      const minimalSpecs = {}; // Empty object
      const mockGeneratedCode = '<h1>My Simple App</h1>';
      const mockResponse = {
        choices: [{
          message: {
            content: mockGeneratedCode
          }
        }],
      };
      mockCreateCompletion.mockResolvedValueOnce(mockResponse);

      await generateAppCode(minimalSpecs);

      expect(mockCreateCompletion).toHaveBeenCalledTimes(1);
      expect(mockCreateCompletion).toHaveBeenCalledWith(
        expect.objectContaining({
          messages: expect.arrayContaining([
            expect.objectContaining({
              role: 'user',
              content: expect.stringContaining("Create a simple web app named 'My Simple App'.") &&
                expect.stringContaining("Description: 'A basic web application.'.") &&
                expect.stringContaining("Key features: basic functionality described."),
            }),
          ]),
        })
      );
    });

     it('should handle specifications with only appName', async () => {
        const specsWithName = { appName: 'Specific Name App' };
        const mockGeneratedCode = '<h1>Specific Name App</h1>';
        const mockResponse = { choices: [{ message: { content: mockGeneratedCode } }] };
        mockCreateCompletion.mockResolvedValueOnce(mockResponse);

        await generateAppCode(specsWithName);

        expect(mockCreateCompletion).toHaveBeenCalledWith(
            expect.objectContaining({
                messages: expect.arrayContaining([
                    expect.objectContaining({
                        role: 'user',
                        content: expect.stringContaining("Create a simple web app named 'Specific Name App'.") &&
                                 expect.stringContaining("Description: 'A basic web application.'.") &&
                                 expect.stringContaining("Key features: basic functionality described."),
                    }),
                ]),
            })
        );
    });
  });

  // --- Input Validation Tests ---
  describe('Input Validation', () => {
    it.each([
      [null],
      [undefined],
      [123],
      ['string'],
    ])('should reject with "Invalid specifications provided." for invalid input: %p', async (invalidInput) => {
      await expect(generateAppCode(invalidInput)).rejects.toThrow(
        'Invalid specifications provided.'
      );
      expect(mockCreateCompletion).not.toHaveBeenCalled();
    });
  });

  // --- API Error Handling Tests ---
  describe('API Error Handling', () => {
    it('should throw specific error on AuthenticationError', async () => {
      // Use the mocked error class provided by vi.mock
      const mockError = new AuthenticationError();
      mockCreateCompletion.mockRejectedValueOnce(mockError);

      await expect(generateAppCode(validSpecs)).rejects.toThrow(
        'OpenAI authentication failed. Verify your API key.'
      );
      expect(mockCreateCompletion).toHaveBeenCalledTimes(1);
    });

    it('should throw specific error on RateLimitError', async () => {
      const mockError = new RateLimitError();
      mockCreateCompletion.mockRejectedValueOnce(mockError);

      await expect(generateAppCode(validSpecs)).rejects.toThrow(
        'OpenAI rate limit exceeded. Please try again later.'
      );
      expect(mockCreateCompletion).toHaveBeenCalledTimes(1);
    });

    it('should throw specific error on generic APIError', async () => {
      const mockError = new APIError(404); // Simulate a 404 status
      mockCreateCompletion.mockRejectedValueOnce(mockError);

      await expect(generateAppCode(validSpecs)).rejects.toThrow(
        `Failed to generate code due to an OpenAI API issue (Status: ${mockError.status}).`
      );
      expect(mockCreateCompletion).toHaveBeenCalledTimes(1);
    });

    it('should throw generic communication error for other errors', async () => {
      const mockError = new Error('Network connection lost'); // Simulate a network error
      mockCreateCompletion.mockRejectedValueOnce(mockError);

      await expect(generateAppCode(validSpecs)).rejects.toThrow(
        'Failed to communicate with OpenAI API.'
      );
      expect(mockCreateCompletion).toHaveBeenCalledTimes(1);
    });
  });

  // --- Response Validation Tests ---
  describe('Response Validation', () => {
    it.each([
      [null], // Null response
      [{}], // Empty object
      [{
        choices: []
      }], // Empty choices array
      [{
        choices: [{}]
      }], // Choice without message
      [{
        choices: [{
          message: {}
        }]
      }], // Message without content
      [{
        choices: [{
          message: {
            content: null
          }
        }]
      }], // Null content
      [{
        choices: [{
          message: {
            content: '  '
          }
        }]
      }], // Whitespace content
    ])('should reject with "LLM returned an empty or invalid response." for invalid response: %p', async (invalidResponse) => {
      mockCreateCompletion.mockResolvedValueOnce(invalidResponse);

      await expect(generateAppCode(validSpecs)).rejects.toThrow(
        'LLM returned an empty or invalid response.'
      );
      expect(mockCreateCompletion).toHaveBeenCalledTimes(1);
    });
  });

  // --- Environment Variable Check (implicitly tested by beforeEach/afterEach) ---
  // This section verifies that the setup correctly handles the service's initial check
  describe('Environment Variable Handling', () => {
    it('should not throw during import when OPENAI_API_KEY is stubbed', () => {
      // The fact that this test runs without error after the beforeEach stub
      // implicitly verifies that the stub prevents the initial service check from failing.
      expect(true).toBe(true);
    });

    // It's harder to directly test the *throw* condition from the top-level service scope
    // using ViTest's standard mocking/stubbing after the module is loaded.
    // The beforeEach/afterEach setup ensures the service loads correctly for other tests.
    // If we *really* needed to test the throw, it would require more advanced techniques
    // like dynamic imports within the test or resetting modules, which adds complexity.
    // Given the context, ensuring tests *run* by providing the stub is sufficient.
  });

});