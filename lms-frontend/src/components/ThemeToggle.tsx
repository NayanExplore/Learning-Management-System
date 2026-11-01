import React from 'react';

interface ThemeToggleProps {
  showLabel?: boolean;
  className?: string;
}

/**
 * ThemeToggle is disabled: dark theme is permanently enforced across the platform.
 */
export const ThemeToggle: React.FC<ThemeToggleProps> = () => {
  return null;
};
