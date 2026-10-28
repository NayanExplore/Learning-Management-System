import { describe, it, expect } from 'vitest';
import * as z from 'zod';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

describe('Authentication Validation Schemas', () => {
  it('validates correct registration data', () => {
    const validData = {
      fullName: 'Priya Sharma',
      email: 'priya@example.com',
      password: 'StrongPassword123!',
    };
    const result = registerSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('rejects short passwords under 8 characters', () => {
    const invalidData = {
      fullName: 'Priya Sharma',
      email: 'priya@example.com',
      password: 'short',
    };
    const result = registerSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('rejects invalid email addresses in login', () => {
    const invalidData = {
      email: 'not-an-email',
      password: 'Password123!',
    };
    const result = loginSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
