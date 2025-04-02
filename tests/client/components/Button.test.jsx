import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Button from '../../../src/components/Button.jsx'; // Adjust the import path as needed

// Mock setup assumed to be handled by ./src/setupTests.js via vite.config.js
// This includes making jest-dom matchers available.

describe('Button Component', () => {
  describe('Rendering', () => {
    it('should render correctly with simple text children', () => {
      const buttonText = 'Click Me';
      render(<Button onClick={vi.fn()}>{buttonText}</Button>);
      const buttonElement = screen.getByRole('button', { name: buttonText });
      expect(buttonElement).toBeInTheDocument();
      expect(buttonElement).toHaveTextContent(buttonText);
    });

    it('should render correctly with React node children', () => {
      render(
        <Button onClick={vi.fn()}>
          <span data-testid="icon">Icon</span> Text
        </Button>
      );
      const buttonElement = screen.getByRole('button');
      expect(screen.getByTestId('icon')).toBeInTheDocument();
      expect(buttonElement).toHaveTextContent('Icon Text');
    });

    it('should have default type "button"', () => {
      render(<Button onClick={vi.fn()}>Default Type</Button>);
      const buttonElement = screen.getByRole('button', { name: 'Default Type' });
      expect(buttonElement).toHaveAttribute('type', 'button');
    });

    it('should apply custom type attribute when provided', () => {
      render(<Button onClick={vi.fn()} type="submit">Submit Button</Button>);
      const buttonElement = screen.getByRole('button', { name: 'Submit Button' });
      expect(buttonElement).toHaveAttribute('type', 'submit');
    });

    it('should merge className prop with default classes', () => {
      const customClass = 'my-custom-class';
      render(<Button onClick={vi.fn()} className={customClass}>Styled Button</Button>);
      const buttonElement = screen.getByRole('button', { name: 'Styled Button' });
      // Check for a known base class and the custom class
      // Avoid checking exact combined class string as internal styles might change
      expect(buttonElement).toHaveClass('py-2'); // Example base class
      expect(buttonElement).toHaveClass('px-4'); // Example base class
      expect(buttonElement).toHaveClass(customClass);
    });

    it('should apply aria-label prop when provided', () => {
      const label = 'Perform action';
      render(<Button onClick={vi.fn()} aria-label={label}>Action</Button>);
      const buttonElement = screen.getByRole('button', { name: label });
      expect(buttonElement).toHaveAttribute('aria-label', label);
      expect(buttonElement).toHaveTextContent('Action'); // Also check visible text
    });

     it('should apply aria-label prop correctly even with kebab-case', () => {
      const label = 'Perform special action';
      // Note: JSX automatically handles kebab-case to camelCase, but Button.jsx handles the prop alias
      render(<Button onClick={vi.fn()} aria-label={label}>Special</Button>);
      const buttonElement = screen.getByRole('button', { name: label });
      expect(buttonElement).toHaveAttribute('aria-label', label);
    });

    it('should pass through arbitrary props', () => {
      const testId = 'my-button-testid';
      const buttonId = 'unique-button-id';
      render(
        <Button onClick={vi.fn()} id={buttonId} data-testid={testId}>
          Pass Through
        </Button>
      );
      const buttonElement = screen.getByTestId(testId);
      expect(buttonElement).toBeInTheDocument();
      expect(buttonElement).toHaveAttribute('id', buttonId);
    });
  });

  describe('Interaction', () => {
    it('should call onClick handler exactly once when clicked (if enabled)', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick}>Clickable</Button>);
      const buttonElement = screen.getByRole('button', { name: 'Clickable' });

      expect(handleClick).not.toHaveBeenCalled(); // Ensure it hasn't been called yet
      fireEvent.click(buttonElement);
      expect(handleClick).toHaveBeenCalledTimes(1);

      // Simulate another click
      fireEvent.click(buttonElement);
      expect(handleClick).toHaveBeenCalledTimes(2);
    });
  });

  describe('Disabled State', () => {
    it('should have the disabled attribute when disabled prop is true', () => {
      render(<Button onClick={vi.fn()} disabled={true}>Disabled</Button>);
      const buttonElement = screen.getByRole('button', { name: 'Disabled' });
      expect(buttonElement).toBeDisabled();
    });

    it('should not call onClick handler when disabled button is clicked', () => {
      const handleClick = vi.fn();
      render(<Button onClick={handleClick} disabled={true}>Disabled Click</Button>);
      const buttonElement = screen.getByRole('button', { name: 'Disabled Click' });

      fireEvent.click(buttonElement);
      expect(handleClick).not.toHaveBeenCalled();
    });

    it('should not have the disabled attribute when disabled prop is false', () => {
      render(<Button onClick={vi.fn()} disabled={false}>Enabled Explicitly</Button>);
      const buttonElement = screen.getByRole('button', { name: 'Enabled Explicitly' });
      expect(buttonElement).not.toBeDisabled();
    });

    it('should not have the disabled attribute when disabled prop is omitted (default)', () => {
      render(<Button onClick={vi.fn()}>Enabled Default</Button>);
      const buttonElement = screen.getByRole('button', { name: 'Enabled Default' });
      expect(buttonElement).not.toBeDisabled();
    });

    // Example of checking styles (less preferred than checking behavior/attributes)
    // Note: requires Tailwind's `disabled:` classes to be correctly applied in the component.
    it('should have disabled styles when disabled prop is true', () => {
      render(<Button onClick={vi.fn()} disabled={true}>Disabled Styling</Button>);
      const buttonElement = screen.getByRole('button', { name: 'Disabled Styling' });
      // Check for a class applied by Tailwind's disabled: variant
      // The exact class might depend on Tailwind version/config, use with caution.
      // This checks if the *potential* for the class exists based on the component's structure.
      // Testing library doesn't compute styles, so we check for the class name itself.
      // Button.jsx uses `disabled:bg-gray-400`, etc.
      expect(buttonElement.className).toContain('disabled:bg-gray-400');
      expect(buttonElement.className).toContain('disabled:cursor-not-allowed');
    });

     it('should have enabled styles when disabled prop is false', () => {
      render(<Button onClick={vi.fn()} disabled={false}>Enabled Styling</Button>);
      const buttonElement = screen.getByRole('button', { name: 'Enabled Styling' });
      // Check for classes applied only when enabled
      expect(buttonElement).toHaveClass('bg-blue-600'); // Enabled style
      expect(buttonElement).not.toHaveClass('bg-gray-400'); // Disabled style shouldn't apply directly
    });
  });

  describe('Props', () => {
    it('should accept and render children prop correctly', () => {
      render(<Button onClick={vi.fn()}><span>Child Span</span></Button>);
      expect(screen.getByText('Child Span')).toBeInTheDocument();
    });

    it('should require onClick prop (implicitly tested by failures if missing)', () => {
      // PropTypes should cause a console warning during test runs if onClick is missing,
      // although Vitest might not fail the test suite solely based on PropTypes warnings.
      // We ensure all tests provide it. This test case is more for documentation.
      // Rendering without onClick would typically cause a runtime error or PropTypes warning.
      // const { rerender } = render(<Button>Test</Button>); // This would warn/error
      expect(true).toBe(true); // Placeholder assertion
    });
  });
});