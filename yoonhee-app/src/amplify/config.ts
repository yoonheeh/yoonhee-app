import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';

// Define the backend resources for the app
export const backend = defineBackend({
  auth,
  data,
}); 