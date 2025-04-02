import React from 'react';
import PropTypes from 'prop-types';

/**
 * Renders an animated loading spinner using SVG and Tailwind CSS.
 * This component is intended to provide visual feedback during asynchronous operations.
 * Its visibility should be controlled by conditional rendering in the parent component.
 *
 * @param {object} props - The component props.
 * @param {string} [props.className=''] - Additional Tailwind CSS classes to apply to the SVG element,
 *                                        allowing for customization of layout (e.g., margins) or overrides
 *                                        (e.g., size, color).
 * @returns {JSX.Element} The rendered SVG loading spinner component.
 */
function LoadingSpinner({ className = '' }) {
  // Combine default classes for the spinner with any additional classes passed via props.
  // Defaults: animation, size, color. className can override or add layout styles.
  const combinedClasses = `animate-spin h-8 w-8 text-blue-600 ${className}`
    .trim()
    .replace(/\s+/g, ' ');

  return (
    <svg
      className={combinedClasses}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      role="status" // Indicates to assistive technologies that content is changing/loading
      aria-live="polite" // Suggests politeness level for screen reader announcements
    >
      {/* Provides accessible text for the spinner */}
      <title>Loading...</title>
      {/* Background circle track */}
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      {/* Foreground spinning arc */}
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
}

// Define prop types for type checking, validation, and documentation.
LoadingSpinner.propTypes = {
  /**
   * A string of additional Tailwind CSS classes to apply to the root SVG element.
   * Useful for adding layout styles (margins, positioning) or overriding defaults
   * like size or color if needed.
   */
  className: PropTypes.string,
};

export default LoadingSpinner;