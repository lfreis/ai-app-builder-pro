import React from 'react';
import PropTypes from 'prop-types';

/**
 * Displays a block of pre-formatted code text received via props.
 * Renders nothing if the code prop is empty or not provided.
 * Ensures code is displayed safely as plain text.
 *
 * @param {object} props - The component props.
 * @param {string} props.code - The code string to display. Must be a non-empty string.
 * @returns {JSX.Element|null} The rendered code display component or null.
 */
function CodeDisplay({ code }) {
  // Conditional Rendering: If code is null, undefined, or an empty string, render nothing.
  if (!code) {
    return null;
  }

  return (
    <div className="bg-gray-900 text-gray-100 rounded-md shadow-md">
      {/*
        The <pre> tag ensures whitespace is preserved.
        Tailwind classes handle:
        - overflow-auto: Adds scrollbars if content exceeds dimensions.
        - p-4: Adds padding inside the block.
        - text-sm: Sets a smaller font size suitable for code.
        - font-mono: Uses a monospaced font family.
      */}
      <pre className="overflow-auto p-4 text-sm font-mono">
        {/*
          The <code> tag semantically indicates code content.
          The {code} expression renders the code prop directly as text content.
          This is crucial for security as it prevents rendering any HTML/script tags
          that might be present in the code string.
        */}
        <code>{code}</code>
      </pre>
    </div>
  );
}

// Define prop types for type checking, validation, and documentation
CodeDisplay.propTypes = {
  /**
   * The string containing the code to be displayed. This component will render
   * nothing if this prop is null, undefined, or an empty string. It is treated
   * strictly as plain text content for security.
   */
  code: PropTypes.string.isRequired,
};

export default CodeDisplay;