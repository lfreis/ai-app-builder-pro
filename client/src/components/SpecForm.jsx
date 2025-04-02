import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Button from './Button.jsx';

/**
 * Renders a form to collect user specifications for the application they want to generate.
 * Manages the form's input state, performs basic client-side validation,
 * and triggers the submission process via a callback prop.
 *
 * @param {object} props - The component props.
 * @param {Function} props.onSubmit - Function to call with the validated form data upon successful submission.
 * @param {boolean} props.isLoading - Indicates if the parent component is processing, used to disable the submit button.
 * @returns {JSX.Element} The rendered specification form component.
 */
function SpecForm({ onSubmit, isLoading }) {
  const [appName, setAppName] = useState('');
  const [appDescription, setAppDescription] = useState('');
  const [appFeatures, setAppFeatures] = useState('');
  const [errors, setErrors] = useState({});

  /**
   * Validates the current form state.
   * @returns {object} An object containing validation errors. Keys correspond to field names.
   */
  const validate = () => {
    const validationErrors = {};
    if (!appName.trim()) {
      validationErrors.appName = 'Application Name is required.';
    }
    if (!appDescription.trim()) {
      validationErrors.appDescription = 'Application Description is required.';
    }
    if (!appFeatures.trim()) {
      validationErrors.appFeatures = 'Key Features are required.';
    }
    return validationErrors;
  };

  /**
   * Handles changes for text input fields, updating state and clearing specific errors.
   * @param {Function} stateSetter - The useState setter function for the field.
   * @param {string} fieldName - The name of the field being updated (e.g., 'appName').
   * @returns {Function} An event handler function for the input's onChange event.
   */
  const handleInputChange = (stateSetter, fieldName) => (event) => {
    const { value } = event.target;
    stateSetter(value);
    // Clear the error for this specific field when the user starts typing
    if (errors[fieldName]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  /**
   * Handles the form submission process.
   * Validates input, sets errors if validation fails, or calls the onSubmit prop
   * with the cleaned specifications object if validation passes.
   * @param {React.FormEvent<HTMLFormElement>} event - The form submission event.
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    const validationErrors = validate();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setErrors({}); // Clear any previous errors on successful validation
      const specifications = {
        appName: appName.trim(),
        appDescription: appDescription.trim(),
        // Split features by newline, trim whitespace, and filter out empty lines
        appFeatures: appFeatures.split('\n')
                                  .map(feature => feature.trim())
                                  .filter(feature => feature !== ''),
      };
      onSubmit(specifications);
    }
  };

  // Common input styling classes
  const baseInputClasses = 'w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500';
  const errorInputClasses = 'border-red-500';
  const errorTextClasses = 'text-red-600 text-xs mt-1';

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Application Name Field */}
      <div className="mb-4">
        <label
          htmlFor="appName"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Application Name
        </label>
        <input
          type="text"
          id="appName"
          value={appName}
          onChange={handleInputChange(setAppName, 'appName')}
          placeholder="e.g., My Cool Project"
          className={`${baseInputClasses} ${errors.appName ? errorInputClasses : ''}`}
          aria-invalid={!!errors.appName}
          aria-describedby={errors.appName ? 'appName-error' : undefined}
        />
        {errors.appName && (
          <p id="appName-error" className={errorTextClasses} role="alert">
            {errors.appName}
          </p>
        )}
      </div>

      {/* Application Description Field */}
      <div className="mb-4">
        <label
          htmlFor="appDescription"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Application Description
        </label>
        <textarea
          id="appDescription"
          value={appDescription}
          onChange={handleInputChange(setAppDescription, 'appDescription')}
          placeholder="Briefly describe what your application does."
          rows="3"
          className={`${baseInputClasses} ${errors.appDescription ? errorInputClasses : ''}`}
          aria-invalid={!!errors.appDescription}
          aria-describedby={errors.appDescription ? 'appDescription-error' : undefined}
        />
        {errors.appDescription && (
          <p id="appDescription-error" className={errorTextClasses} role="alert">
            {errors.appDescription}
          </p>
        )}
      </div>

      {/* Key Features Field */}
      <div className="mb-4">
        <label
          htmlFor="appFeatures"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Key Features (One per line)
        </label>
        <textarea
          id="appFeatures"
          value={appFeatures}
          onChange={handleInputChange(setAppFeatures, 'appFeatures')}
          placeholder="List the main features, e.g.,&#10;User login&#10;Display data&#10;Submit form"
          rows="4"
          className={`${baseInputClasses} ${errors.appFeatures ? errorInputClasses : ''}`}
          aria-invalid={!!errors.appFeatures}
          aria-describedby={errors.appFeatures ? 'appFeatures-error' : undefined}
        />
        {errors.appFeatures && (
          <p id="appFeatures-error" className={errorTextClasses} role="alert">
            {errors.appFeatures}
          </p>
        )}
      </div>

      {/* Submission Button */}
      <div className="mt-6 flex justify-end">
        <Button
          type="submit"
          disabled={isLoading}
          onClick={() => {}} // onClick is required by Button propTypes, but handled by form onSubmit
          aria-label="Generate Application Code"
        >
          {isLoading ? 'Generating...' : 'Generate Application'}
        </Button>
      </div>
    </form>
  );
}

// Define prop types for type checking, validation, and documentation
SpecForm.propTypes = {
  /**
   * Callback function executed when the form is submitted with valid data.
   * Receives an object containing the application specifications
   * (appName, appDescription, appFeatures as an array of strings).
   */
  onSubmit: PropTypes.func.isRequired,
  /**
   * Boolean flag indicating if the parent component is in a loading state
   * (e.g., waiting for API response). Used to disable the submit button.
   */
  isLoading: PropTypes.bool.isRequired,
};

export default SpecForm;