import React from 'react';
import PropTypes from 'prop-types';

/**
 * A reusable button component with consistent styling and accessibility features.
 * It handles click events, disabled states, and allows for custom styling overrides via Tailwind CSS.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The content to display inside the button (text, icons, etc.).
 * @param {Function} props.onClick - The function to call when the button is clicked.
 * @param {boolean} [props.disabled=false] - Whether the button is disabled.
 * @param {'button' | 'submit' | 'reset'} [props.type='button'] - The type attribute of the button.
 * @param {string} [props.className=''] - Additional Tailwind CSS classes to merge with the default styles.
 * @param {string} [props.aria-label] - An accessibility label, useful if button content isn't descriptive text.
 * @param {object} [props...} - Any other standard HTML button attributes (e.g., id, data-*).
 * @returns {JSX.Element} The rendered button component.
 */
function Button({
  children,
  onClick,
  disabled = false,
  type = 'button',
  className = '',
  'aria-label': ariaLabel, // Alias for kebab-case prop
  ...props // Capture any other standard button props
}) {
  // Base styles applicable whether enabled or disabled
  const baseClasses =
    'py-2 px-4 font-semibold rounded-md transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white';

  // Styles specific to the enabled state (non-disabled)
  const enabledClasses =
    'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500';

  // Styles specific to the disabled state, applied via Tailwind's disabled: variant prefix
  // These variants automatically apply when the disabled attribute is true.
  const disabledClasses =
    'disabled:bg-gray-400 disabled:text-gray-700 disabled:cursor-not-allowed';

  // Combine classes:
  // 1. Start with base classes.
  // 2. Add enabled styles only if the button is NOT disabled.
  // 3. Add Tailwind's disabled: variants (these only take effect when disabled attribute is present).
  // 4. Append any custom classes from the className prop (allows overrides).
  // 5. Trim whitespace and replace multiple spaces with single space for clean output.
  const combinedClasses = `
    ${baseClasses}
    ${!disabled ? enabledClasses : ''}
    ${disabledClasses}
    ${className}
  `
    .trim()
    .replace(/\s+/g, ' ');

  return (
    <button
      type={type}
      onClick={onClick} // The native disabled attribute prevents onClick from firing
      disabled={disabled}
      className={combinedClasses}
      aria-label={ariaLabel}
      {...props} // Spread remaining props onto the button element
    >
      {children}
    </button>
  );
}

// Define prop types for type checking, validation, and documentation
Button.propTypes = {
  /**
   * The content rendered inside the button. Can be text, an icon, or any valid React node.
   */
  children: PropTypes.node.isRequired,
  /**
   * Function to execute when the button is clicked. Required.
   */
  onClick: PropTypes.func.isRequired,
  /**
   * If true, the button will be visually and functionally disabled.
   */
  disabled: PropTypes.bool,
  /**
   * Specifies the button's type attribute ('button', 'submit', or 'reset').
   * Defaults to 'button' to prevent accidental form submissions.
   */
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  /**
   * A string of additional Tailwind CSS classes to apply, allowing for customization.
   */
  className: PropTypes.string,
  /**
   * Provides an accessible label for the button, especially important if the button
   * content is not descriptive text (e.g., an icon-only button).
   */
  'aria-label': PropTypes.string,
};

export default Button;