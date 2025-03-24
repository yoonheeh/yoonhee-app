'use client';

import { Amplify } from 'aws-amplify';
import { fetchAuthSession } from 'aws-amplify/auth';
import config from '../aws-exports';

// Configure Amplify on the client side
Amplify.configure(config);

// Helper function to check if user is authenticated
export async function isAuthenticated() {
  try {
    const session = await fetchAuthSession();
    return session.tokens !== undefined;
  } catch (error) {
    return false;
  }
}

// Helper function to get the current authenticated user
export async function getCurrentUser() {
  try {
    const { tokens } = await fetchAuthSession();
    return tokens?.idToken?.payload || null;
  } catch (error) {
    return null;
  }
} 